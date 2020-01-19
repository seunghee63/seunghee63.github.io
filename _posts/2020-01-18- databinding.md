---
title: "[Android] 아키텍쳐 스터디 4주차 - DataBinding"
date: 2020-01-18 16:05:00 -0400
categories: 
    - Android
tags:
    - 스터디
    - Android
    - 아키텍쳐
---

> 완성되지 않은 게시글입니다.


# 4주차

1. 환겅셜정



2. 바인딩 객체를 만드는 방법

- activity
- fragment
- Adapter



3. dataBinding Syntax

@{}

- variable - import 
- 리소스 접근도 가능
- String format 도 가능!
- 

4. 

- BindingImpl 



null or primitive type 이 들어감



5. 

```
binding.tvFirst // null

!! : 플랫폼타입 -  nullable 일 수도 있음! 실제로는

```

onBindingViewHolder -> adapter의 queue에 담아둿다가...

executePendingBindings() -> 





6. Binding Class





7. 2-way binding // 타입이 다를 때도 2waybining방식을 많이 사용!

@{} // one way

@={} // two way -> obserble 필드(데이터를 옵져버블하게 바꿈)

​    -> 무한루프를 타지 않기 위한 방법들! return 



### 과제

* 안드로이드 코틀린 Extension 지워서 xml연결하는 코드 없애버리고!!! databinging    
* bind - recyclerView 내부적으로 데이터 처리 할 수 있도록 



* BR에 선언을 해 놓음 bindingResource -> binding 한 것을 동적으로 처리할 때! 사용 ?! (정확히 모르겠듬….…?!)

