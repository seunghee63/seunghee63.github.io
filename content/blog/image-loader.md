---
title: 라이브러리 없이 이미지 로드 구현하기
date: "2022-04-03T11:00:00.169Z"
description: "라이브러리 없이 이미지 로드 구현하기(Bitmap 이미지 캐싱)"
tags: ['ImageLoader', 'Bitmap', 'BitmapFactory', 'Cache', 'LRU']
disqus: true
---
</br>


안드로이드에서는 이미지를 로딩할 때 Picasso, Glide, Coil 과 같은 이미지 처리 라이브러리를 주로 사용한다. 구글도 Bitmap 관리의 복잡성을 근거로 Glide 사용을 권장하고 있다.

기존 Glide 를 사용하고 있던 프로젝트에 Coil 을 도입하는 과정에서, Coil 과 Glide 의 차이를 살펴보게 되었고 이미지 라이브러리들의 동작 원리 까지 학습한 후 가벼운 ImageLoader 를 구현해 보았다.

함께 이해하고 구현해 보도록 하자.
</br>
</br>



## | overview
이미지 로더의 동작 과정은 다음과 같다.

1. 이미지 로딩 요청
2. memory cache 에 bitmap 존재 여부 확인
    1. 존재하는 경우 해당 bitmap 사용
3. disk cache 의 bitmap 존재 여부 확인
    1. 존재하는 경우 해당 bitmap 사용 후, memory cache 에 저장
4. url 소스를 통해 sample size 의 bitmap 생성
5. cache 에 저장

해당 포스팅에서는 비트맵을 생성하고, 캐싱하고, bitmap 리사이징 하는 과정까지를 담아보았다.

## 이미지의 Bitmap 관리
- Bitmap : 이미지 표현을 위해 주로 사용되는 객체를 말한다.
- Bitmapfactory : 파일, stream, bite array 와 같은 다양한 소스에서 Bitmap 객체를 생성하는 클래스를 말한다.
    - [BitmapFactory.Options](https://developer.android.com/reference/android/graphics/BitmapFactory.Options?hl=ko) 클래스를 통해 디코딩 옵션을 지정한다.

## Cache
단순히 Bitmap 을 UI 에 보여주는 것은 어렵지 않지만, 한 번에 대용량의 이미지들을 로드하는것은 복잡하다. 
리스트 뷰의 경우, 아이템이 보이지 않을 때 메모리 사용량을 줄이는 방식으로 동작한다. GC 또한 더 이상 이미지를 참조하지 않을 것이라고 가정하고 비트맵을 해제한다. 그러나 이 방법은 빠른 ui 로딩이 어렵고 on-screen 시 매번 이미지 처리가 반복된다는 점에서 최적의 해결법으로 보기 힘들다.

메모리 캐시와 디스크 캐시로 더 효율적으로 데이터를 관리 해 보자.

### 1) LRU Class

캐싱 작업에 앞서 LRU 알고리즘을 이해해 보자. LRU 알고리즘은 Least Recently Used 의 준말로, 최근에 가장 적게 참조된 원소를 제거하는 기법이다. 안드로이드에는 LruCache, DiskLruCache 가 있다. 

LruCache 는 비트맵 캐싱 작업에 적절한 메모리 캐시 객체이다. get() 메소드가 호출되면 cache의 top으로 아이템을 이동시킨다. 최근에 강한 참조로 참조된 객체를 LinkedHashMap 에 유지하고, 할당된 사이즈를 초과하기 전에 최근 가장 적게 사용된 멤버를 제거한다. 

LruCache 는 아래와 같이 구현되어 있다.

```kotlin
class LRUCache extends LinkedHashMap<Integer, Integer>{
    private int maxSize;
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.maxSize = capacity;
    }

    //return -1 if miss
    public int get(int key) {
        Integer v = super.get(key);
        return v == null ? -1 : v;
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

	// 조건을 만족하지 않는 경우, 가장 오래된 요소 삭제
    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return this.size() > maxSize; //must override it if used in a fixed cache
    }
}
```

```java
LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)
```

- LinkedHashMap 의 생성자의 accessOrder 값을 true로 넘겨 순서 모드를 사용한다.
</br>
</br>

**적절한 사이즈의 LruCache 사용**을 위해 다음 요소들을 고려해야 한다. 
- 앱의 여유공간
- 한 번에 화면에 보여지는 이미지의 개수/ 준비되어야 하는(곧 보여져야 하는) 이미지의 개수
- 기기 해상도
- 비트맵의 크기와 구성요소. 그에 따라 필요한 메모리.
- 이미지 접근 빈도
    - 특정 항목을 항상 메모리에 유지 or 여러 개의 LruCache 로 관리
- 질과 양의 균형
    - 저품질의 많은 수의 비트맵을 저장하는 것이 유용할 수도 있음

LruCache 는 이 정도로 마치고, 이제 본격적으로 메모리 캐시 코드를 작성해보자.

### 2) Memory Cache

메모리 캐시는 bitmap 에 대한 빠른 접근이 가능해 퍼포먼스 개선에 많은 도움이 된다. 하지만 앱 메모리를 차지한다는 단점이 있다. Cache 는 매우 작기때문에 `java.lang.OutOfMemory`를 야기하고, 다른 작업의 메모리 작업량을 조금밖에 남기지 못하기도 한다.

1. LruCache 구성
```kotlin
class ImageCache {
    private lateinit var memoryCache: LruCache<String, Bitmap>

    init {
        initializeCache()
    }

		// 최적의 cache 사이즈 설정을 위한 로직 
    private fun initializeCache() {
				// kilobytes.
        val maxMemory = (Runtime.getRuntime().maxMemory() / 1024).toInt()
        // 메모리의 1/8 할당(일반 hdpi 장치에서 최소 4MB)
				val cacheSize = maxMemory / 8
        memoryCache = object : LruCache<String, Bitmap>(cacheSize) {
            override fun sizeOf(key: String, bitmap: Bitmap): Int {
                return bitmap.byteCount / 1024 //아이템 갯수X, kilobytes  
            }
        }
    }

    fun addImage(key: String?, value: Bitmap?) {
        if (memoryCache[key] == null) {
            memoryCache.put(key, value)
        }
    }

    fun getImage(key: String?): Bitmap? {
        return if (key != null) {
            memoryCache[key]
        } else {
            null
        }
    }
}
```
2. 이미지가 로드 될 때, LruCache 확인
```kotlin 
fun loadImage(resId: String, imageUrl: String?): Bitmap? {
        return imageCache.getImage(resId) ?: run {
            val bmp = loadBitmap(imageUrl)
            imageCache.addImage(resId, bmp)
            bmp
        }
    }
```
- memory cache 의 접근 및 업데이트는 *background* 에서 이루어지도록 한다.
- 샘플 이미지 사이즈를 측정하는 `calculateInSampleSize()` 메소드 구현부는 하단에 위치한다.

### 3) Disk Cache

GridView 와 같은 큰 dataset 은 쉽게 메모리 캐시를 차지한다. 또한 다른 앱 작업(전화 통화)에 의해 앱이 중단될 경우, 백그라운드에서 종료되어 메모리 캐시가 소멸하게 되고 이를 다시 처리해야 하기도 한다.

이때 Disk cache 를 사용하면 데이터를 유지하는 것이 가능하다. 단, 디스크에서 이미지를 가져오는 것은 디스크 읽기 시간을 예측하기 힘들기 때문에 백그라운드 스레드에서 수행해야 한다.

다음은 기존 메모리 캐시에 디스크 캐시를 추가하는 업데이트된 예제 코드이다. (안드로이드 디벨로퍼 공식 예제와 동일하다.)

```kotlin
private const val DISK_CACHE_SIZE = 1024 * 1024 * 10 // 10MB
private const val DISK_CACHE_SUBDIR = "thumbnails"
...
private var diskLruCache: DiskLruCache? = null
private val diskCacheLock = ReentrantLock()
private val diskCacheLockCondition: Condition = diskCacheLock.newCondition()
private var diskCacheStarting = true

override fun onCreate(savedInstanceState: Bundle?) {
    ...
    // Initialize memory cache
    ...
    // Initialize disk cache on background thread
    val cacheDir = getDiskCacheDir(this, DISK_CACHE_SUBDIR)
    InitDiskCacheTask().execute(cacheDir)
    ...
}

internal inner class InitDiskCacheTask : AsyncTask<File, Void, Void>() {
    override fun doInBackground(vararg params: File): Void? {
        diskCacheLock.withLock {
            val cacheDir = params[0]
            diskLruCache = DiskLruCache.open(cacheDir, DISK_CACHE_SIZE)
            diskCacheStarting = false // Finished initialization
            diskCacheLockCondition.signalAll() // Wake any waiting threads
        }
        return null
    }
}

internal inner class  BitmapWorkerTask : AsyncTask<Int, Unit, Bitmap>() {
    ...

    // Decode image in background.
    override fun doInBackground(vararg params: Int?): Bitmap? {
        val imageKey = params[0].toString()

        // Check disk cache in background thread
        return getBitmapFromDiskCache(imageKey) ?:
                // Not found in disk cache
                decodeSampledBitmapFromResource(resources, params[0], 100, 100)
                        ?.also {
                            // Add final bitmap to caches
                            addBitmapToCache(imageKey, it)
                        }
    }
}

fun addBitmapToCache(key: String, bitmap: Bitmap) {
    // Add to memory cache as before
    if (getBitmapFromMemCache(key) == null) {
        memoryCache.put(key, bitmap)
    }

    // Also add to disk cache
    synchronized(diskCacheLock) {
        diskLruCache?.apply {
            if (!containsKey(key)) {
                put(key, bitmap)
            }
        }
    }
}

fun getBitmapFromDiskCache(key: String): Bitmap? =
        diskCacheLock.withLock {
            // Wait while disk cache is started from background thread
            while (diskCacheStarting) {
                try {
                    diskCacheLockCondition.await()
                } catch (e: InterruptedException) {
                }

            }
            return diskLruCache?.get(key)
        }

// Creates a unique subdirectory of the designated app cache directory. Tries to use external
// but if not mounted, falls back on internal storage.
fun getDiskCacheDir(context: Context, uniqueName: String): File {
    // Check if media is mounted or storage is built-in, if so, try and use external cache dir
    // otherwise use internal cache dir
    val cachePath =
            if (Environment.MEDIA_MOUNTED == Environment.getExternalStorageState()
                    || !isExternalStorageRemovable()) {
                context.externalCacheDir.path
            } else {
                context.cacheDir.path
            }

    return File(cachePath + File.separator + uniqueName)
}
```
- UI 스레드에서 메모리 캐시를 확인하는 동안 백그라운드 스레드에서 디스크 캐시를 확인한다. 이미지 처리가 완료되면 나중에 사용할 수 있도록 비트맵이 메모리와 디스크 캐시에 모두 추가된다.

## Bitmap 최적화(Bitmap resize)
: 큰 비트맵을 효율적으로 업로드 하기

일반적으로 이미지는 UI 에 비해 크기가 크다. 제한된 메모리로 작업하는 경우 메모리에 저해상도 이미지를 로드하는 것이 유용하다. 
다음은 UI 의 크기와 일치하게 Bitmap 파일을 생성하는 과정이다.

**비트맵 크기 및 유형 읽기**
```kotlin
private fun loadBitmap(imageUrl: String?): Bitmap? {
        val bmp: Bitmap? = null
        try {
            val url = URL(imageUrl)
            val options = Options().apply {
                inJustDecodeBounds = true
            }
            val result = decodeStream(url.openStream())
            options.outHeight = result.height
            options.outWidth = result.width
            options.inSampleSize = calculateInSampleSize(options)
            options.inJustDecodeBounds = false
            return decodeStream(url.openStream(), null, options)
        } catch (e: MalformedURLException) {
            e.printStackTrace()
        } catch (e: IOException) {
            e.printStackTrace()
        }
        return bmp
    }
```
- 비트맵이 생성되면 메모리할당이 시도되어 OutOfMemory 가 발생 할  수 있다. inJustDecodeBounds 옵션을 활성화 시키면 비트맵이 메모리에 로드 되는 것을 막을 수 있다.
- `inSampleSize` 을 설정하면 sample 사이즈를 설정 할 수 있다.
</br>

**축소버전 로드하기**
```kotlin
private fun calculateInSampleSize(
        options: Options,
        reqWidth: Int = 160,
        reqHeight: Int = 160
    ): Int {
        val (height: Int, width: Int) = options.run { outHeight to outWidth }
        var inSampleSize = 1

        if (height > reqHeight || width > reqWidth) {
            val halfHeight: Int = height / 2
            val halfWidth: Int = width / 2

            while (halfHeight / inSampleSize >= reqHeight && halfWidth / inSampleSize >= reqWidth) {
                inSampleSize *= 2
            }
        }
        return inSampleSize
    }
```
</br>
</br>
</br>

---

면접에서 간간이 이미지 라이브러리의 동작 원리를 물어 보는 경우가 있어 해당 내용을 가볍게 정리해 본적이 있다. 하지만 실제로 구현까지 해보며 알게 된 것은 이미지 로딩에 비트맵 가공에서부터 메모리/디스크 캐시, 비동기 처리, 리사이징까지 다양한 기술이 적용된다는 것이다.

무엇보다도 라이브러리 사용할 때, 이해를 바탕으로 활용 하는지도 알 수 있으니 면접 질문으로 손색이 없는 질문이지 않았나 싶다.


</br>

**ref**
* [https://developer.android.com/topic/performance/graphics/cache-bitmap](https://developer.android.com/topic/performance/graphics/cache-bitmap)
* [https://developer.android.com/topic/performance/graphics/load-bitmap?hl=ko](https://developer.android.com/topic/performance/graphics/load-bitmap?hl=ko)
* https://m.blog.naver.com/cg072/221479331086