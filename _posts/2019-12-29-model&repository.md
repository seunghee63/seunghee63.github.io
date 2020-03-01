---
title: "[Android] Architecture - Model 이란? & Repository Pattern 적용하기"
date: 2019-12-29 16:05:00 -0400
categories: Architecture
tags:
    - 스터디
    - Android
    - 아키텍쳐
---



## Model이란?

MVC, MVP, MVVM … 아키텍쳐에 대해 공부를 하기 위해 찾다보면 앞에 `M` 이 붙은 다양한 패턴들을 볼 수 있습니다! 각각의 패턴에 공통으로 존재하는 `M` 과 `V`는 무엇일까요?

여기서 `M`이 이번 포스팅에서 알아 볼 `Model` 입니다!

`Model` 은 무엇을 말하는걸까요? 바로 **데이터를 가져오는 로직** 을 말합니다.  

데이터 저장소에 접근해 데이터를 검색, 삽입, 삭제, 수정하기 위한 코드 등 포함하기 때문에, Model 은 단순하게 '데이터'가 아닌 '데이터를 가져오는 로직' 이라고 할 수 있습니다!

`V`는 `View`를 가르키는데요, `View` 란 Activity, Fragment 와 같은 사용자 인터페이스(UI)를 말합니다! `View` 는 **데이터를 입력받고(in) 데이터를 보여주는(out) 역할**을 합니다! 

앞에서 봤던 다양한 패턴들은 `Model`을 `View`에 뿌리려고 하는데 어떤 방식(VM, P, VC, I)을 사용 할 지에 따라 MVVM, MVP, MVI 등으로 나눠지는 것 이였답니다!

```
* 정리!
- Model : 데이터를 가져오는 로직
- View : ui (Activity, Fragment)
```



## Repository Pattern

이제까지 Model에 대해 알아보았는데.. 갑자기 `Repository Pattern` 이란 무엇일까요? `Repository Pattern` 이란, 데이터 저장소와 데이터를 사용하는 로직을 완전히 분리시키는 것을 목적으로 하는 패턴을 말합니다.

그렇다면 `Repository`는 무엇일까요?!

우리는 서버와의 통신을 통해서 데이터를 받아 올 수도 있지만, 네트워크가 연결되지 않은 경우에는 local 저장소에서 데이터를 받아와서 데이터를 받아 와 View에 뿌려 줄 수도 있습니다. 이를 판단하고 분기처리를 하며 데이터를 뿌려주는 역할을 하는 것이 `Repository` 입니다.

> DataSource : 데이터가 있는 곳
>
> - Remote : 원격 - Api
>
> - Local : 내부 - Room, sqlite 등..

Activity -> **Repository** -> Romote/Local DataSource

`Repository` 는  <u>도메인(기능)과 데이터 사이를 중재하는 매핑 레이어</u> 라고 할 수 있습니다. 도메인은 데이터가 필요 할 때, `Repository`에 데이터를 요청하고,`Repository`는 도메인이 요청한 데이터를 가공해서 보내줍니다.

### Repository Pattern의 장점

1. 코드 재사용
   1. 데이터 층을 완전히 분리 해 놓았기 때문에 
2. Activity의 코드 단순화
   1. 반복되던 데이터를 받아오는 코드를 줄일 수 있음
   2. Reposotory의 remote, local 데이터를 구분

### Repository 구조

> 패키징 방법은 절대! 해당 포스팅이 정답이 아닙니다!!!! 

![image](https://user-images.githubusercontent.com/41153567/73078446-85c6b500-3f05-11ea-89f4-d28d927c3e15.png)




> MovieRemoteDataSource.kt

```kotlin
interface MovieRemoteDataSource {
    fun getMovieData(
        keyword: String,
        display: Int,
        start : Int,
        onSuccess: (List<MovieData>) -> Unit,
        onFailure: (Throwable) -> Unit
    )
}
```

> MovieRemoteDataSourceImpl.kt

```kotlin
object MovieRemoteDataSourceImpl : MovieRemoteDataSource {

    private val network = NetworkServiceImpl.service

    override fun getMovieData(
        keyword: String,
        display: Int,
        start: Int,
        onSuccess: (List<MovieData>) -> Unit,
        onFailure: (Throwable) -> Unit
    ) {
        network.getMoreMovieSearch(keyword, display, start)
            .enqueue(object : retrofit2.Callback<MovieDataResponse> {
                override fun onFailure(call: Call<MovieDataResponse>, t: Throwable) {
                    onFailure(t)
                }
                override fun onResponse(
                    call: Call<MovieDataResponse>,
                    response: Response<MovieDataResponse>
                ) {
                    onSuccess(response.body()!!.items)
                }
            })
    }
}
```



Repository

> MovieRepository.kt

```kotlin
interface MovieRepository {
    fun getMovieData(
        keyword: String,
        cnt: Int,
        start : Int,
        onSuccess: (List<MovieData>) -> Unit,
        onFailure: (Throwable) -> Unit
    )
}
```

> MovieRepositoryImpl.kt

```kotlin
class MovieRepositoryImpl : MovieRepository {

    override fun getMovieData(
        keyword: String,
        cnt: Int,
        start: Int,
        onSuccess: (List<MovieData>) -> Unit,
        onFailure: (Throwable) -> Unit
    ) {
        MovieRemoteDataSourceImpl.getMovieData(
            keyword = keyword,
            display = cnt,
            start = start,
            onSuccess = onSuccess,
            onFailure = onFailure
        )
    }
}
```

reference 
- [https://imcreator.tistory.com/105](https://imcreator.tistory.com/105)

> 피드백은 언제든 환영입니다 'ㅁ'!!!!
