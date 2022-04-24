---
title: compose의 생명주기(Recomposition) 이해하기
date: "2022-04-10T11:00:00.169Z"
description: "compose 이해하기, compose의 생명주기, recomposition"
tags: ['compose', 'lifecycle', 'recomposition']
disqus: true
---
</br>

사내 Admin에 Compose를 도입했다. 이전에 사이드 프로젝트에서 적용 해 본 경험이 있는지라 Compose로 UI를 구성하고, 상태와 데이터를 관리 하는 것은 시간은 걸리되 생각보다 그리 어렵지 않았다. 오히려 Compose의 편의성을 몸소 체감하며 개발을 하는 중이다.

그러나 예상과 다르게 자잘한 이슈들은 Compose의 핵심인 recomposition의 동작과정을 이해하지 못하는 데서 왔다.
Compose의 생명주기는 매우 심플하다. 처음에는 이 간단한 lifecycle이 개발을 더 단순하고 편리하게 해 줄 것이라고 기대했지만, 개발을 하면 할수록 fragment와 activity의 라이프사이클에 익숙한 나는 생명주기에 맞춰 이벤트를 처리하는 방식과 리엑티브 패러다임의 선언적 UI의 데이터 업데이트 방식에 혼란이 찾아왔다.

Compose에 대해 가볍게 훑어보고, 동작원리와 생명주기를 파악해 보려고 한다.
이후 프로젝트를 진행하며 마주했던 이슈들을 토대로 Compose로 개발 할 때 고려하면 좋은 점을 정리 해 보았다.

---

## | overview

1. Compose란?
    1. Compose의 특징
    2. 선언형 패러다임 
2. Compose의 라이프사이클
3. recomposition 관련 이슈 (2편에서)
    1. Composable의 잦은 재호출
    2. 생명주기에 따른 이벤트 처리
    3. paging 데이터 유지하기

---
## Compose란?
Android에서 UI 개발을 위해 제공하는 툴킷이다.
반응형 프로그래밍 모델을 기반하여 동작하며, 이에 코틀린의 간결성과 손쉬움을 결합했다. 

### Compose의 특징
Compose에는 다음과 같은 특징이 있다.
<ol>
<li class="li-title"><b>선언형</b></li>

우리는 이전 xml을 활용한 UI 개발에서 뷰의 계층을 줄이기 위해 Constraintlayout의 사용을 권장한다.</br>
그러나 선언형 프로그래밍 패러다임은 다르다. 처음부터 모든 구조를 생성한 후, 변경사항이 있는 경우에만 뷰가 업데이트 된다. 컴포즈에서는 이를 `recomposition` 이라고 하는데, 이는 나중에 다뤄보도록 하자. 

<li class="li-title"><b>보일러 플레이팅 코드의 감소</b></li>
Activity, Fragment와 XML를 하나의 View에서 관리가 가능해진다. 따라서 xml을 Activity, Fragment에 inflate하는 과정이 사라진다.</br>
또한 MVVM 아키텍처일 경우 VM에서 상태를 쉽게 전달 받을 수 있다. 데이터를 binding 한 후, observe 하고 update 하는 코드가 필요 없어진다.</br>
커스텀 뷰를 생성하는 경우, 이전에는 ui를 그리기 위한 xml 파일, 동작을 위한 kotlin 파일, 속성 설정을 위한 파일 등이 필요했지만, compose 의 경우 composable 에서 처리가능하다.</br>
</br>

<li class="li-title"><b>재사용 가능한 UI</b></li>
</br>

<li class="li-title"><b>동적인 UI 구성</b></li>
xml이 아닌 kotlin으로 동작하기 때문에, if 문을 사용한 특정 UI 노출여부, 반복문, 리스트 등과 같은 동적 UI를 구성하는 것이 가능해진다. 
</ol>

</br>

그러나 **아쉬운점**도 존재한다. 
1. Resource 관련 기능 제한
2. 지원 라이브러리의 제한
3. 러닝커브로 인한 생산성 저하

### 선언형 프로그래밍 과 명령형 프로그래밍
위에서 명령형/선언형 프로그래밍에 대한 개념이 등장하는데, 이해를 돕기 위해 내용을 조금 더 추가해 보겠다. 
안드로이드 UI를 작성하는데 있어서 명령형으로 구현하는 방식과 선언형으로 구현하는 방식에는 다음과 같은 차이가 있다.

<li class="li-title"><b>명령형</b></li>
각 위젯은 자체의 내부 상태를 유지하고 getter, setter 메소드를 노출한다.
그리고 우리는 state를 직접 변경하며 UI를 업데이트 한다.

</br>
</br>

<li class="li-title"><b>선언형</b></li>
각 위젯은 stateless 상태이며 getter, setter 메소드를 노출하지 않는다. composable 함수를 인수로 호출하며 UI 를 업데이트 한다.

상태가 변경되면 composable은 새 데이터와 함께 다시 호출한다. 이 과정을 recomposition(재구성) 이라고 한다. 

여기서 리컴포지션이라는 개념이 재등장하게 되는데, 이제 Compose의 생명주기를 공부하며 함께 알아보자.


## Compose 의 lifecycle

![compose-lifecycle-0](../assets/compose-lifecycle.png)

글의 초입에서도 말했듯, Compose의 lifecycle은 아주 심플하다.

`Composable이 Composition 시작 -> 0회 이상 recomposition -> comosition 종료`

그 중, recomposition 이라는 keyword에 집중해보자. composable 내에서 데이터가 변경 된 경우, UI를 재구성 한다. 
이때, composable은 모든 UI를 업데이트 하는것이 아니라, 값이 변경된 경우에만 composable을 호출하여 업데이트를 진행한다. 
참고로 호출 지점은 컴포저블이 호출되고 있는 소스코드의 위치이다. 

공식문서에서는 recomposition을 다음과 같이 정의한다. 

1. 값에 종속되지 않은 다른 함수는 recompositon 되지 않는다.
2. 값에 종속되는 함수와 람다만 재생성한다.
3. 비용이 많이 드는 작업을 구성 외부의 다른 스레드로 이동하고 mutableStateOf 또는 LiveData를 사용하여 Compose에 데이터를 전달할 수 있다.

코드를 보면 조금 더 이해하기가 쉽다.

```kotlin
@Composable
fun LoginScreen(showError: Boolean) {
    if (showError) {
        LoginError()
    }
    LoginInput()
}
@Composable
fun LoginInput() { /* ... */ }
```

LoginScreen은 LoginError와 LoginInput이라는 두개의 컴포저블을 가지고 있다.
LoginScreen의 매개변수인 showError의 값이 변경 될 경우, LoginInput는 유지 되고 LoginError만 recomposition이 진행된다.

구조상 하위 컴포저블이 모두 바뀐다고 착각하기 쉬우니 유의하도록 하자.

## recomposition 관련 이슈
compose를 적용하고 있는 프로젝트는 Single Activity 위에 Screen을 띄우는 방식으로 동작했다.
프로젝트를 진행하며 마주한 이슈는 다음과 같다.

1. Composable의 잦은 재호출
2. 생명주기에 따른 이벤트 처리
3. 페이징 리스트 데이터의 유지

### Composable의 잦은 재호출
👉🏻 **화면 전환을 위해 파라미터로 전달되는 navigation**

👉🏻 **Scope의 Recomposition**


### View의 생명주기에 따른 이벤트 처리
👉🏻 **activity/fragment의 라이프 사이클 활용하기**


### 리스트의 데이터 유지
👉🏻 **페이징 데이터의 유자**

해당 목차는 다음 포스팅에 이어서 작성해 보도록 하겠다.

---

사실 프로젝트를 진행한 이슈들과 해결책까지 하나의 게시글에 작성하고 싶었지만, 글이 너무 길어 가독성이 떨어지는 이슈로 불가피하게 1,2편으로 나누어 연재하게 되었다.
개요만 남겨뒀는데, 아마 2편이 올라오면 해당 목차는 지워질 듯 하다.
여하튼 2편의 글도 거의다 완성이 된 상태라 금방 업데이트 될 듯 하다.