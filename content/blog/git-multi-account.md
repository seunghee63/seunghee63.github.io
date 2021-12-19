---
title: Git/Bitbucket 멀티계정
date: "2021-12-07T11:00:00.169Z"
description: "여러개의 Git(or Bitbucket) 계정을 하나의 컴퓨터에서 동시에 사용하는 방법을 알아보자"
tags: ['git', 'bitbucket', '멀티계정']
disqus: true
---
# Table of Contents
1. [ISSUE](#00.-ISSUE)
2. [원인](#01.-원인)
3. [실습](#02.-실습)
4. [ssh_키생성](##01-ssh-키-생성)


# 00. ISSUE

회사에 입사하고 마이그레이션 할 틈도 없이 회사 개발환경을 셋팅 하게 되어, 기본 계정이 회사계정이 되었다. 후에 개인작업을 해야하는 상황에서 private 레포지토리에 접근이 불가능하고 push가 되지 않는 이슈를 마주하게 되었다. 

```
 git push origin master                                                     
Username for 'https://github.com': seunghee63
Password for 'https://seunghee63@github.com':
remote: Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.
remote: Please see [https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/) for more information.
fatal: Authentication failed for '[https://github.com/seunghee63/KakaoBankAssignment.git/](https://github.com/seunghee63/KakaoBankAssignment.git/)'
```

![git-error0](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/11d27512-423f-4021-8fdf-c5becf2cfd7c/Untitled.png)

![git-error1](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/54a7f931-5bbe-44f1-a346-3fd71151bc42/Untitled.png)

# 01. 원인

> [In July 2020](https://github.blog/2020-07-30-token-authentication-requirements-for-api-and-git-operations/), we announced our intent to require the use of token-based authentication (for example, a personal access, OAuth, or GitHub App installation token) for all authenticated Git operations. Beginning August 13, 2021, we will no longer accept account passwords when authenticating Git operations on GitHub.com.
> 

[https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/)

이전에는 아이디와 비밀번호만 있으면 권한을 받고 접근할 수 있었는데, 이제는 토큰 기반 인증만을 허용하는 방식으로 변경되었다.

이럴 때는 계정 마다 SSH key를 만들어서 등록해서 사용하면 된다.

SSH key는 공개키와 비공개키로 구성되어 있다. 키를 생성하면 공개키와 비공개키가 만들어지게 되는데, 비공개키는 로컬 머신(클라이언트)에 위치하게 되고, 공개키는 리모트 머신(깃 혹은 빗버킷)에 위치해야 한다.

회사계정이 비트버킷이라 비트버킷 계정을 추가하는 방법을 찾아보다 보니 조금 더 디테일하게 git 계정을 연동시키는 방법을 찾아보게 되었다.

# 02. 실습

- **연결된 계정 확인**
    
    ` git config --list` 명령어를 통해 계정이 해당 데스크탑이 연결된 계정을 확인 할 수 있다.
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a5e76068-84e2-4d5b-b1b3-27b182aa67dc/Untitled.png)
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/089d8940-59ab-4dad-b3ba-f14b2572ce43/Untitled.png)
    
    ```
    credential.helper=osxkeychain
    core.excludesfile=/Users/yangseunghui/.gitignore_global
    difftool.sourcetree.cmd=opendiff "$LOCAL" "$REMOTE"
    difftool.sourcetree.path=
    mergetool.sourcetree.cmd=/Applications/Sourcetree.app/Contents/Resources/opendiff-w.sh "$LOCAL" "$REMOTE" -ancestor "$BASE" -merge "$MERGED"
    mergetool.sourcetree.trustexitcode=true
    **user.name=song0603
    user.email=song0603@회사계정.com**
    
    commit.template=/Users/yangseunghui/.stCommitMsg
    core.repositoryformatversion=0
    core.filemode=true
    core.bare=false
    :
    ```
    

## 01) ssh 키 생성

**ssh-keygen을 이용해 키쌍 생성**

`ssh-keygen -t rsa -C "개인/회사 계정"`

ssh-keygen 라는 프로그램을 활용하여 개인계정과 회사계정의 ssh 키를 각각 생성 한다. 

- rsa 라는 암호화 방식으로 키를 생성한다.

### **01-1) seunghee63(개인계정) 키 생성**

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cab11c55-d8c2-4530-88fc-21f554397b24/Untitled.png)

```
** ssh-keygen -t rsa -C "0603yang@개인계정.com"**
Generating public/private rsa key pair.
**Enter file in which to save the key (/Users/yangseunghui/.ssh/id_rsa): /Users/yangseunghui/.ssh/id_rsa_personal**
Created directory '/Users/yangseunghui/.ssh'.
**Enter passphrase (empty for no passphrase):
Enter same passphrase again:**
Your identification has been saved in /Users/yangseunghui/.ssh/id_rsa_personal.
Your public key has been saved in /Users/yangseunghui/.ssh/id_rsa_personal.pub.
The key fingerprint is:
SHA256:iULBetClbDqiVUW0DZScJaup/fou06pqbspuotLn6Yo 0603yang@개인계정.com
The key's randomart image is:
+---[RSA 3072]----+
|   o.*O+.        |
|  ..o++*         |
|   o* o .        |
|  .=.o . .       |
|. +.+ . S        |
|.o + .           |
|... ..           |
|+=. +o.          |
|E=o**B+          |
+----[SHA256]-----+
```

1. **/Users/yangseunghui/.ssh/id_rsa_personal**
.ssh 폴더 하단에 파일이름을 입력한다.
2. 키쌍 생성 중에 암호 입력을 요청하는 단계가 있는데, 이때 암호를 입력하지 말고 넘겨야 한다. 암호를 입력하면 Git/Bitbucket 서버와는 키로 인증함에도 불구하고 ssh-key를 사용할 때 암호를 입력해야 하는 번거로움이 생긴다.

### 01-2) **song2(회사계정) 키 생성**

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9f0b6d3a-c2e0-4371-ba1b-1e87d03a622d/Untitled.png)

```
** ssh-keygen -t rsa -C "song0603@회사계정.com"**
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/yangseunghui/.ssh/id_rsa): /Users/yangseunghui/.ssh/id_rsa_company
**Enter passphrase (empty for no passphrase):
Enter same passphrase again:**
Your identification has been saved in /Users/yangseunghui/.ssh/id_rsa_company.
Your public key has been saved in /Users/yangseunghui/.ssh/id_rsa_company.pub.
The key fingerprint is:
SHA256:LEq8PbatX2hNfXLv+oPLXbRJWzI7yqJi926s41tnq4E song0603@회사계정.com
The key's randomart image is:
+---[RSA 3072]----+
|                 |
|                 |
|                 |
|   .   .   .     |
|    o . S . o =.o|
|   . + . =   +.*=|
|    o + E.= o ++o|
|     .o=oo+=.+.+.|
|     .o*BO+o+oo++|
+----[SHA256]-----+
```

1. **/Users/yangseunghui/.ssh/id_rsa_company**
2. 마찬가지로 암호는 입력하지 않고 넘긴다.

### 01-3) 확인

`ls ~/.ssh` 명령어 실행

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bc402746-b000-4025-b09e-cba895b3e86a/Untitled.png)

- .pub 확장자의 공개키와 확장자가 명시되어 있지 않은 비공개키가 한쌍씩 생성되면 성공!

## 02) ssh-agent 에 키 등록

매번 SSH 키 패스워드 입력을 하는것은 번거롭다. 이때 ssh-agent에 키를 등록해두면 좀 더 편리하게 사용할 수 있다. ssh-agnet는 백그라운드에서 SSH 인증 정보를 관리합니다. ssh-agent가 실행되어있는지부터 확인한 후, 
[출처] [https://www.lainyzine.com/ko/article/creating-ssh-key-for-github/](https://www.lainyzine.com/ko/article/creating-ssh-key-for-github/)

키 사용을 위해서는 ssh-agent 에 등록해야 한다.

- (실행 안 되어 있다면) ssh-agent 실행하고 ssh-add를 이용해 키 추가
    
    ![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4eecdc4d-3293-40ad-a667-ea8f40ff5494/Untitled.png)
    
    - SSH 키 목록
    - The agent has no identities.
    - **출처**:[https://latentis.tistory.com/47](https://latentis.tistory.com/47) [Meandering Trajectory]

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9198fe15-8b91-4f64-829e-d4600c5ee1ee/Untitled.png)

- **세션 유효기간 설정**
    
    옵션으로 -t를 주고 시간을 설정하면 유효기간을 설정할 수 있다. 
    
    **출처**:[https://www.lesstif.com/lpt/ssh-agent-private-key-ssh-add-123338804.html](https://www.lesstif.com/lpt/ssh-agent-private-key-ssh-add-123338804.html)
    

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dde4330c-ab52-4166-8ce7-20af155f75df/Untitled.png)

**확인**

ssh-add -l

`eval "$(ssh-agent -s)"` 명령어 실행 ?

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fa71bc4d-455a-466d-a4e0-8168fa56f1f4/Untitled.png)

## 03) SSH config 추가

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/595d41da-da18-402a-8a3c-59aeddb73dde/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/09e6f8bc-2b6c-44e3-adb3-1fde64754575/Untitled.png)

```
# company
Host bitbucket.org-song0603
HostName bitbucket.org
User song0603
IdentityFile ~/.ssh/id_rsa_company
# personal
Host github.com-seunghee63
HostName github.com
User seunghee63
IdentityFile ~/.ssh/id_rsa_personal
```

호스트와 호스트네임은 SSH 방식을 통해 내려받을때 

## 04) github & Bitbucket 에 ssh 키 등록하기

`cat ~~~`

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/479d05a2-38d1-4888-a22d-d0cf8d8311ff/Untitled.png)

동일한 키를 서로 다른 계정에 등록하려고 하면 이미 다른 계정에서 사용되고 있다는 에러와 함께 빗버킷에서 등록을 거부한다.

출처: [https://latentis.tistory.com/47](https://latentis.tistory.com/47) [Meandering Trajectory]

![개인 계정](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/875f032a-f159-4343-8ce4-420544394598/Untitled.png)

개인 계정

**확인**

`ssh -T [HostName]`

- `ssh -T git@github.com`
- `ssh -T git@bitbucket.org`

하나씩 다 테스트 해 보았다 . . .

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/53095af0-4d14-4f5a-8517-6a5ee8037610/Untitled.png)

## 05) gitConfig 수정

여러 SSH key를 쓰는 경우 GitHub이 어떤 계정으로 push를 하는지 구분할 수 없기 때문에 계정 전환이 필요하다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cd1cfa2e-fa87-467f-be78-43c1407de696/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/836fb158-b9e9-4a8d-9b91-a244375f1f90/Untitled.png)

개인 프로젝트 같은경우 AndroidStudioProjects 와 blog 디렉토리에 프로젝트가 담겨있는데, 해당 디렉토리에서 명령어를 실행 할 경우 개인 계정으로 작업이 되도록 수정했다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/10507086-f46a-4685-bb31-11bfb80ff59f/Untitled.png)

# 03. 결과

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fa04cfd2-5ad9-4983-8259-c57d820e32ef/Untitled.png)

삽질을 너무 많이해서 .. 

---

덧붙임

설정을 완벽하게 해 놓았는데, 후에 똑같은 이슈가 발생한다면 02) ssh-agent 에 키 등록

> ref
> 

[https://yosuniiiii.com/github-계정-여러개-사용하기-on-mac-6588237f9671](https://yosuniiiii.com/github-%EA%B3%84%EC%A0%95-%EC%97%AC%EB%9F%AC%EA%B0%9C-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-on-mac-6588237f9671)