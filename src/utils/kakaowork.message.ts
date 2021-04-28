import { IMentoring, ISchedule } from '../interfaces/soma.interface';

export const broadcastMessage = (conversationId: number) => {
  return {
    conversationId,
    text: '저어희는 크롤링을 하겠습니다. 거기에 소마를 곁들인',
    blocks: [
      {
        type: 'header', // 헤더는 type을 header로 고정
        text: '미니 프로젝트 15팀',
        style: 'yellow', // blue, yello, red 택 1
      },
      {
        type: 'text',
        text:
          '저희 15팀은 소마를 진행하면서 자유멘토링에 어려움을 겪은 여러분을 위해 솔루션을 제공하려 합니다!\n미니 프로젝트 평가가 끝나더라도 계속 사용할 수 있는 챗봇이니 많이 사용해주세요 :)',
        markdown: true,
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'user_search',
        text: '멘티/멘토 검색',
        style: 'primary',
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'mentoring_search',
        text: '멘토링 검색',
        style: 'primary',
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'calendar',
        text: '일정 확인',
        style: 'primary',
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'noti_on_off',
        text: '신규 멘토링 알림 켜고 끄기',
        style: 'primary',
      },
    ],
  };
};

export const userSearchRequestModal = () => {
  return {
    view: {
      title: '멘티/멘토 검색',
      accept: '검색하기',
      decline: '취소',
      value: 'user_search',
      blocks: [
        {
          type: 'label',
          text: '멘티와 멘토 중 선택해주세요.',
          markdown: false,
        },
        {
          type: 'select',
          name: 'type',
          required: true,
          options: [
            {
              text: '멘티',
              value: 'mentee',
            },
            {
              text: '멘토',
              value: 'mento',
            },
          ],
          placeholder: '선택해주세요.',
        },
        {
          type: 'label',
          text: '이름을 입력해주세요.',
          markdown: false,
        },
        {
          type: 'input',
          name: 'value',
          required: false,
          placeholder: 'ex) 홍길동',
        },
      ],
    },
  };
};

export const userSearchResultModal = (name: string, skills: string) => {
  return {
    text: '멘티 검색',
    blocks: [
      {
        type: 'header',
        text: '🔎 멘티 검색 결과',
        style: 'blue',
      },
      {
        type: 'description',
        term: '이름',
        content: {
          type: 'text',
          text: name,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '관심기술',
        content: {
          type: 'text',
          text: skills,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'button',
        text: '자세히 보기',
        style: 'default',
      },
    ],
  };
};

export const mentoringSearchRequestModal = () => {
  return {
    view: {
      title: '멘토링 검색',
      accept: '검색하기',
      decline: '취소',
      value: 'mentoring_search',
      blocks: [
        {
          type: 'label',
          text: '검색 분류를 알려주세요.',
          markdown: false,
        },
        {
          type: 'select',
          name: 'type',
          required: true,
          options: [
            {
              text: '제목',
              value: 'title',
            },
            {
              text: '작성자',
              value: 'writer',
            },
            {
              text: '내용',
              value: 'content',
            },
          ],
          placeholder: '검색 분류',
        },
        {
          type: 'label',
          text: '내용을 입력해주세요.',
          markdown: false,
        },
        {
          type: 'input',
          name: 'value',
          required: false,
          placeholder: 'ex) 머신러닝',
        },
      ],
    },
  };
};

export const mentoringSearchResultModal = (mentoringInfo: IMentoring) => {
  return {
    text: '멘토링 검색 결과',
    blocks: [
      {
        type: 'header',
        text: '🔎 멘토링 검색 결과',
        style: 'blue',
      },
      {
        type: 'description',
        term: '제목',
        content: {
          type: 'text',
          text: mentoringInfo.title,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '작성자',
        content: {
          type: 'text',
          text: mentoringInfo.writer,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '접수기간',
        content: {
          type: 'text',
          text: `${mentoringInfo.applyStartDate} ~ ${mentoringInfo.applyEndDate}`,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '상태',
        content: {
          type: 'text',
          text: mentoringInfo.state,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '접수인원',
        content: {
          type: 'text',
          text: mentoringInfo.appliedCnt,
          markdown: false,
        },
        accent: true,
      },
      // {
      //   type: 'button',
      //   text: '자세히 보기',
      //   style: 'default',
      // },
    ],
  };
};

export const calendarRequestModal = () => {
  return {
    view: {
      title: '일정 확인',
      accept: '검색하기',
      decline: '취소',
      value: 'calendar',
      blocks: [
        {
          type: 'label',
          text: '몇 월의 일정을 확인할까요?',
          markdown: false,
        },
        {
          type: 'select',
          name: 'type',
          required: true,
          options: [
            {
              text: '4월',
              value: 4,
            },
            {
              text: '5월',
              value: 5,
            },
            {
              text: '6월',
              value: 6,
            },
            {
              text: '7월',
              value: 7,
            },
            {
              text: '8월',
              value: 8,
            },
            {
              text: '9월',
              value: 9,
            },
            {
              text: '10월',
              value: 10,
            },
            {
              text: '11월',
              value: 11,
            },
            {
              text: '12월',
              value: 12,
            },
          ],
          placeholder: '선택해주세요.',
        },

      ],
    },
  };
};

export const calendarResultModal = (month: number, schedules: ISchedule[]) => {
  const output = {
    text: '월간 일정',
    blocks: [],
  };

  if (!schedules) {
    return output;
  }

  for (const schedule of schedules) {
    output.blocks.push(
      {
        type: 'description',
        term: '제목',
        content: {
          type: 'text',
          text: schedule.title,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '일정',
        content: {
          type: 'text',
          text: `${schedule.startDate} ~ ${schedule.endDate}`,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '구분',
        content: {
          type: 'text',
          text: schedule.classification,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'divider',
      },
    );
  }

  return output;
};
