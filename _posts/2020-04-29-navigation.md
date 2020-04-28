---
title: "[Android] Jetpack : Navigation 이란? & 하단탭바(Bottom Navigation) 구현하기"
date: 2020-04-29 06:05:00 -0400
categories: Android
tags:
    - Navigation
    - Android
    - Jetpack

---

(작업 중)

# 🤢 Android Jetpack : Navigation 이란?

안드로이드 네비게이션은 `탐색` 구현을 도와주는 라이브러리 입니다. 앱을 탐색한다는 것은 다른 화면으로 이동한다는 것을 말합니다.

이제까지 우리는 Intent, transaction 등을 이용하여 이를 구현했습니다. 단순 버튼 클릭을 통한 창 이동 정도는 쉽게 구현할 수 있었지만 백스택(backstack), 하단 네비게이션, 다소 복잡한 인수를 넘기는 케이스 등을 구현 할 때는 다소 어려움이 있었습니다.

이 때, Navigation을 사용하면 이를 더 쉽게, 직관적으로 구현 할 수 있습니다.

## 💡Navigation Component 의 장점
아래는 Navigation Component 사용 시 장점입니다.
- 프래그먼트 트랜잭션 처리.
- 기본적으로 '위로'와 '뒤로' 작업을 올바르게 처리.
- 애니메이션과 전환에 표준화된 리소스 제공.
- 딥 링크 구현 및 처리.
- 최소한의 추가 작업으로 탐색 UI 패턴(예: 탐색 창, 하단 탐색) 포함.
- [Safe Args](https://developer.android.com/guide/navigation/navigation-pass-data#Safe-args) - 대상 사이에서 데이터를 탐색하고 전달할 때 유형 안정성을 제공하는 그래프 플러그인입니다.
- **`ViewModel`** 지원 - 탐색 그래프에 대한 **`ViewModel`**을 확인해 그래프 대상 사이에 UI 관련 데이터를 공유합니다.

하나 하나가 어떤 상황에서 어떻게 적용 되는지는 천천히 알아가 보도록 해요!

## 🔍탐색 구성요소

**탐색 구성요소**는 `Navigation Graph`, `NavHostFragment`, `NavController` 이렇게 세 가지로 구성되며, 그 내용은 아래와 같습니다.
![image](https://user-images.githubusercontent.com/41153567/80524433-8f5f2d80-89ca-11ea-9284-364d5e54d61b.png)

###  1. `탐색 그래프`
새로운 리소스 유형입니다. 모든 탐색 관련 정보가 하나의 중심 위치에 모여 있는 XML 리소스입니다. 그래프의 XML 모든 부분들이 담겨있습니다.
![image](https://user-images.githubusercontent.com/41153567/80524709-0694c180-89cb-11ea-9894-2d956c302019.png)


- Destination : 모든 화면을 말합니다. 탐색하려는 곳을 나타냅니다. 모든 화면은 분할이 되어있습니다. 데스티네이션을 누르면, 딥링크 URL, Arguments 등의 정보를 알 수 있습니다.![image](https://user-images.githubusercontent.com/41153567/80524631-e49b3f00-89ca-11ea-859f-3bfcff1cdf04.png)

- Action : Destination을 연결하고 있는 화살표를 말합니다. 사용자가 이동 할 수 있는 다양한 경로를 가리킵니다. 액션을 누르면, 해당 액션에 대한 다양한 정보(데이터, 트랜잭션 에니메이션, 백스택 조정 등)를 알 수 있습니다.![image](https://user-images.githubusercontent.com/41153567/80524641-ea912000-89ca-11ea-974b-c91653288a46.png)


###  2. `NavHostFragment`
분할 탐색을 하는 경우 사용 되는, 레이아웃을 추가 하는 분할 위젯을 말합니다. 탐색 그래프의 Destination을 교환하는 곳을 말합니다. 

![image](https://user-images.githubusercontent.com/41153567/80524792-24622680-89cb-11ea-8c91-512d2461f0f9.png)

###  3. `NavController`
NavHost에서 앱 탐색을 관리하는 객체로, 탐색이 작동하도록 하는 NavHostFragment는 개별적으로 NavController를 가지고 있습니다. 아래와 같이 코드를 입력하면, NavHostFragment에서 보이는 분할을 교환합니다.
![image](https://user-images.githubusercontent.com/41153567/80524862-49569980-89cb-11ea-8093-f3e105847ba9.png)
단, 이는 SafeArgs Plugin 을 통해 조금 더 안전하고 보증된 유형의 탐색과 인자 전달을 할 수 있습니다. 이는 조금 더 학습 후에 정리 해 보도록 하겠습니다.


# 🤢 하단탭바(Bottom Navigation) 구현하기
요즘 앱에서 쉽게 볼 수 있는 탐색입니다. ~~~~ 후에 보충하기 

1. Gradle 추가
```kotlin
        implementation 'android.arch.navigation:navigation-fragment:1.0.0'
        implementation 'android.arch.navigation:navigation-ui-ktx:1.0.0'
```
- 탐색 UI 라이브러리
- Kotlin KTX extensions
⇒ 옵션 메뉴(Option Menus), 하단 탐색(Bottom Navigation), 탐색 뷰(Navigation View), 탐색 창(Navigation Drawer) 지원
⇒ 액션바(ActionBar), 툴바(ToolBar), 접힌툴바(Collapsing Toolbar)

### ref

구글 공식문서 : [https://developer.android.com/guide/navigation](https://developer.android.com/guide/navigation)
블로그 : [https://codechacha.com/ko/android-navigation-basic/](https://codechacha.com/ko/android-navigation-basic/)
