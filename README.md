<h4 align="center"> 


  ![TOAST UI Editor](https://uicdn.toast.com/toastui/img/tui-editor-bi.png)

  > 소프트웨어 마에스트로 유저 검색과 멘토링 알림 챗봇

</h4>

<br/>

<p align = "center">
  <img src="https://user-images.githubusercontent.com/18183560/84614193-59392700-af00-11ea-9a55-4a90a6ab5fe8.gif" />
</p>


<br/>

## 🚩 Table of Contents

- [🚩 Table of Contents](#-table-of-contents)
- [🤖 About](#-about)
  - [기획 계기](#기획-계기)
  - [기능 소개](#기능-소개)
- [🏃 Getting Started](#-getting-started)
  - [1. 설치](#1-설치)
  - [2. .env 환경변수 추가](#2-env-환경변수-추가)
  - [3. 실행](#3-실행)
- [🔧 Architecture](#-architecture)
- [💬 Authors](#-authors)
- [💡 Reference](#-reference)

(+ 사용 메뉴얼, 코드 설치 메뉴얼 분리)

<br/>

## 🤖 About

### 기획 계기

해당 챗봇을 기획하게 된 계기

### 기능 소개


- #### 최초 메세지

  ![markdown](https://user-images.githubusercontent.com/18183560/84381972-d3c62600-ac24-11ea-99e2-9640b0a2bfe8.png)

   * **웰컴 메세지** : 멘티의 이름을 검색검색, 일정, 멘토링 검색 on/off

- #### 유저 검색

  ![wysiwyg](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fc0ecf648-1486-4e3b-a927-ab59bae0a813%2FUntitled.png?table=block&id=859550a1-d3a0-4115-8d10-ffe5083f4f9f&width=3840&userId=d05dd97c-5d47-471e-a5cb-26cd8a57ebf7&cache=v2)

  * **멘티 검색** : 멘티의 이름을 검색
  * **멘토 검색** : 멘토의 이름을 검색

- #### 일정

  ![UI](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/cc82cc33-9f9c-4cd4-93cb-ffc21a5cf284/6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210428T073511Z&X-Amz-Expires=86400&X-Amz-Signature=967f42c7de471b99b5c57ab5a5d6f5ff63d3aaf068939cefb739fd0e4622c5f7&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%226.png%22)

  * **새로운 일정 알림** : 매달 1일이 되면 해당하는 달 일정을 알림
  * **월간 일정 조회** : 월간 일정 조회

- #### 멘토링 검색

  ![plugin](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/37c312f5-762c-45ad-aed9-921af85f6344/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210428T073537Z&X-Amz-Expires=86400&X-Amz-Signature=271a825f76675d190bcd209bd02cd8704c075f1aa59b32b9333e382d78c7accc&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

  * **멘토링 검색** : 멘토링 검색 기능

- #### 신규 멘토링 알림 설정

  ![newmentoring](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ed50e4f1-1a7c-4eea-af45-b7bc2639910e/newMentoringNoti.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210428%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210428T073432Z&X-Amz-Expires=86400&X-Amz-Signature=61d7b9e1138fbe5126916e1d90ebcd88add48c474386ca96c7c232916dfbead5&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22newMentoringNoti.png%22)

  * **신규 멘토링 정보** : 신규 멘토링 등록시 멘토링 정보와 상세 URL 제공

<br/>

## 🏃 Getting Started

### 1. 설치

```bash
$ git clone https://github.com/SOMA-MINI-TEAM-15/chatbot_project.git
$ cd chatbot_project
$ npm install 
```

### 2. .env 환경변수 추가

카카오워크 앱 키와 크롤링에 사용 될 소프트웨어 마에스트로 계정 아이디 비밀번호를 `.env` 환경변수 파일을 만들어 입력합니다.

```bash
$ cd [root] # root 폴더로 이동
$ touch .env
```

```md
# .env example

KAKAOWORK_API_KEY = '카카오워크 앱 키'
USERNAME = '소프트웨어 마에스트로 계정 아이디'
PASSWORD = '소프트웨어 마에스트로 계정 비밀번호'
PORT = '없을 시 기본 3000 포트'
```

### 3. 실행

```bash
$ npm run dev
```

<br/>

## 🔧 Architecture

가장 핵심 파일은 아래의 2개 파일입니다.

- src/app.ts
  - 미들웨어 초기화
    - HTTP Request parsing
    - cors 처리
    - 로깅
  - 라우터 등록
  - 에러 핸들링
- src/server.ts
  - 환경변수 여부 확인
  - 실제 서버 동작

그 외에 파일들은 `app.ts`와 함께 클라이언트의 요청에따라 아래의 역할을 차례대로 수행합니다.

1. Client's HttpRequest 발생
2. Routing: 요청에 맞게 Controller를 호출합니다.
3. Validator: DTO를 기반으로 입력 데이터를 검증합니다.
4. Controller: 서비스 로직을 호출하고 서비스에서 에러 발생시 에러 미들웨어로 넘겨줍니다.
5. Service: 서비스 로직을 수행합니다. 예를 들어 인증, 암호화, 데이터베이스 접근 등을 수행합니다. (이번 프로젝트에서는 크롤링, AI서비스와 연동 등을 수행할 수 있습니다!)
6. Response: Controller에서 발생한 결과를 내보냅니다.

<br/>

## 💬 Authors

-
-
-
-
-
-

<br/>

## 💡 Reference

- https://github.com/ljlm0402/typescript-express-starter