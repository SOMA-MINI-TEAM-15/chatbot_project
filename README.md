# 소마 12기 카카오워크 챗봇 프로젝트 팀 15

소프트웨어 마에스트로 12기 미니 프로젝트인 카카오워크 챗봇 만들기 프로젝트의 레포입니다.

## 코드 레퍼런스

https://github.com/ljlm0402/typescript-express-starter

## 구조

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

## README History

- 2021.04.20 초기 코드 업로드 및 설명 추가
- 2021.04.19 레포 생성
