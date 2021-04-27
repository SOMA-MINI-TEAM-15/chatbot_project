// 챗봇 사용자
export interface IChatUser {
    // 개인 채팅에 대한 정보를 가지는 데이터
    id: string; // 카카오워크 채팅 유저 고유 ID
    user?: IMentee; // 소마 연수생 계정과 카카오워크 채팅 유저 ID를 1대1로 매칭
    mentoringNotificationMethods: string[]; // 공지를 받을 멘토링 종류(방법) ['new:all', 'new:keyword:AI', 'keyword:백엔드', 'time:2d', .. etc -> 정의 필요]
    // 기타 기능
    specialMentorings: IMentoring[]; // 종민님 아이디어: 관심있는 멘토링 알림 받는 기능용
  }
  
  // 소마 사용자
  export interface IUser {
    name: string; // 사용자 이름
    email: string; // 사용자 이메일
    major: string; // 멘토: 학력 | 멘티: 학과
    location: string; // 멘토: 재직회사 | 멘티: 거주지역
    skills: string[]; // 멘토: 보유기술 | 멘티: 관심기술
    info1: string; // 첫번째 장문 소개(멘토/멘티 속성 이름 다름)
    info2: string; // 두번째 장문 소개(멘토/멘티 속성 이름 다름)
  }
  
  // 소마 멘티
  export interface IMentee extends IUser {
    appliedMentorings: IMentoring[]; // 신청한 멘토링 배열
  }
  
  // 소마 멘토
  export interface IMentor extends IUser {
    mentoredMentorings: IMentoring[]; // 해당 멘토 유저가 진행한 멘토링 배열
  }
  
  // 소마 멘토링
  export interface IMentoring {
    id: string; // NO. 에 있는 숫자가 아니라 링크의 qustnrSN 프로퍼티이다.
    title: string; // 제목
    state: string; // 상태: (마감 / 대기 / 접수중)
    createdAt: Date; // 등록일
    mentoringDate: Date; // 특강일
    appliedCnt: number; // 접수인원
    writer: string; // 작성자(멘토와 1대1 매칭 안될 우려 염려해서 string형으로 작성)
    mentor?: IMentor; // 멘토링 멘토
    applyStartDate: Date; // 접수기간 시작
    applyEndDate: Date; // 접수기간 끝
    location: string; // 장소
    content: string; // 본문
    appliedMentees: IMentee[]; // 신청한 멘티 배열
  }
  
  // 소마 알림
  export interface INotice {
    id: string; // NO. 에있는 숫자가 아니라 링크의 nttId 프로퍼티이다.
    title: string; // 제목
    writer: string; // 작성자
    createdAt: Date; // 등록일
    content: string; // 본문
  }
  
  // 소마 일정
  export interface ISchedule {
    title: string; // 제목
    classification: string; // 구분
    startDate: Date; // 일정 시작
    endDate: Date; // 일정 끝
  }
  