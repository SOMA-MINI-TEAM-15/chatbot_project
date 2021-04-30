import dayjs from 'dayjs';
import { IChatUser, IMentoring, ISchedule, ISomaUser } from '../interfaces/soma.interface';

export const broadcastMessage = (conversationId: number) => {
  return {
    conversationId,
    text: '저어희는 크롤링을 하겠습니다. 거기에 소마를 곁들인',
    blocks: [
      {
        type: 'image_link',
        url: 'https://i.ibb.co/z8nnny6/chatbot-title.png',
      },
      {
        type: 'text',
        text: '*SWM Bot*',
        markdown: true,
      },
      {
        type: 'text',
        text:
          '저희 15팀은 소마를 진행하면서 예비멘토링 기간에 어려움을 겪은 여러분을 위해 솔루션을 제공하려 합니다!\n미니 프로젝트 평가가 끝나더라도 계속 사용할 수 있는 챗봇이니 많이 사용해주세요 :)',
        markdown: true,
      },
      {
        type: 'context',
        content: {
          type: 'text',
          text: '[SWM Bot 사용방법](https://github.com/SOMA-MINI-TEAM-15/chatbot_project)',
          markdown: true
        },
        image: {
          type: 'image_link',
          url: 'https://image.flaticon.com/icons/png/128/2232/2232688.png'
        }
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'user_search',
        text: '👩‍👦 멘티/멘토 검색',
        style: 'primary',
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'mentoring_search',
        text: '🔎 멘토링 검색',
        style: 'primary',
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'calendar',
        text: '📅 일정 확인',
        style: 'primary',
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'noti_on_off',
        text: '💡 신규 멘토링 알림 켜고 끄기',
        style: 'primary',
      },
    ],
  };
};

export const newLectureModal = (conversationId, mentoring: IMentoring) => {
  return {
    conversationId,
    text: '신규 멘토링 알림',
    blocks: [
      {
        type: 'image_link',
        url: 'https://i.ibb.co/hyfnyhs/image.png',
      },
      {
        type: 'text',
        text: '*💡 신규 멘토링이 등록되었습니다!*',
        markdown: true,
      },
      {
        type: 'description',
        term: '제목',
        content: {
          type: 'text',
          text: mentoring.title,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '멘토',
        content: {
          type: 'text',
          text: mentoring.writer,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '접수기간',
        content: {
          type: 'text',
          text: `${dayjs(mentoring.applyStartDate).format('YYYY-MM-DD')} ~ ${dayjs(mentoring.applyEndDate).format('YYYY-MM-DD')}`,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '특강일',
        content: {
          type: 'text',
          text: `${dayjs(mentoring.mentoringDate).format('YYYY-MM-DD')}`,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '장소',
        content: {
          type: 'text',
          text: mentoring.mentoringLocation,
          markdown: false,
        },
        accent: true,
      },
    ],
  };
};

export const userSearchRequestModal = () => {
  return {
    view: {
      title: '멘티/멘토 검색',
      accept: '검색',
      decline: '취소',
      value: 'user_search',
      blocks: [
        {
          type: 'label',
          text: '구분',
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

export const userSearchResultModal = (type: string, users: ISomaUser[]) => {
  const modal: any = {
    text: `${type === 'mentee' ? '멘티' : '멘토'} 검색 결과`,
    blocks: [
      {
        type: 'header',
        text: `🔎 ${type === 'mentee' ? '멘티' : '멘토'} 검색 결과`,
        style: 'blue',
      },
      {
        type: 'image_link',
        url: 'https://i.ibb.co/yRYRpsL/kobu-agency-7okk-Fhxrx-Nw-unsplash.png',
      },
    ],
  };

  if (users.length === 0) {
    modal.blocks.push({
      type: 'description',
      term: '메세지',
      content: {
        type: 'text',
        text: '존재하지 않아요.',
        markdown: false,
      },
      accent: true,
    });

    return modal;
  }

  for (const [index, user] of users.entries()) {
    modal.blocks.push(
      {
        type: 'description',
        term: '이름',
        content: {
          type: 'text',
          text: user.name,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '관심기술',
        content: {
          type: 'text',
          text: user?.major.join(', '),
          markdown: false,
        },
        accent: true,
      },
    );

    if (index !== users.length - 1) {
      modal.blocks.push({
        type: 'divider',
      });
    }
  }

  return modal;
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

export const mentoringSearchResultModal = (mentoringInfo: IMentoring[]) => {
  const modal: any = {
    text: '멘토링 검색 결과',
    blocks: [
      {
        type: 'header',
        text: '🔎 멘토링 검색 결과(최신 3개)',
        style: 'blue',
      },
      {
        type: 'image_link',
        url: 'https://i.ibb.co/LN3TLNF/photo-1552581234-26160f608093.jpg',
      },
    ],
  };

  if (mentoringInfo.length === 0) {
    modal.blocks.push({
      type: 'description',
      term: '메세지',
      content: {
        type: 'text',
        text: '존재하지 않아요.',
        markdown: false,
      },
      accent: true,
    });

    return modal;
  }

  if (mentoringInfo.length > 3) {
    mentoringInfo = mentoringInfo.slice(0, 3);
  }

  for (const [index, mentoring] of mentoringInfo.entries()) {
    modal.blocks.push(
      {
        type: 'description',
        term: '제목',
        content: {
          type: 'text',
          text: mentoring.title,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '작성자',
        content: {
          type: 'text',
          text: mentoring.writer,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '특강일',
        content: {
          type: 'text',
          text: `${dayjs(mentoring.mentoringDate).format('YYYY-MM-DD')}`,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '장소',
        content: {
          type: 'text',
          text: mentoring.mentoringLocation,
          markdown: false,
        },
        accent: true,
      },
      {
        type: 'description',
        term: '접수기간',
        content: {
          type: 'text',
          text: `${dayjs(mentoring.applyStartDate).format('YYYY-MM-DD')} ~ ${dayjs(mentoring.applyEndDate).format('YYYY-MM-DD')}`,
          markdown: false,
        },
        accent: true,
      },
    );
    if (index !== mentoringInfo.length - 1) {
      modal.blocks.push({
        type: 'divider',
      });
    }
  }

  return modal;
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
              value: '4',
            },
            {
              text: '5월',
              value: '5',
            },
            {
              text: '6월',
              value: '6',
            },
            {
              text: '7월',
              value: '7',
            },
            {
              text: '8월',
              value: '8',
            },
            {
              text: '9월',
              value: '9',
            },
            {
              text: '10월',
              value: '10',
            },
            {
              text: '11월',
              value: '11',
            },
            {
              text: '12월',
              value: '12',
            },
          ],
          placeholder: '선택해주세요.',
        },
      ],
    },
  };
};

export const calendarResultModal = (month: number, schedules: ISchedule[]) => {
  const modal: any = {
    text: '월간 일정',
    blocks: [
      {
        type: 'header',
        text: `📅 ${month} 월 SWM 월간 일정표`,
        style: 'blue',
      },
      {
        type: 'image_link',
        url: 'https://i.ibb.co/VBZSzCr/behnam-norouzi-F32j-Py9-SMaw-unsplash.png',
      },
    ],
  };

  if (schedules.length === 0) {
    modal.blocks.push({
      type: 'description',
      term: '메세지',
      content: {
        type: 'text',
        text: `${month}월에는 등록된 일정이 없어요.`,
        markdown: false,
      },
      accent: true,
    });

    return modal;
  }

  for (const [index, schedule] of schedules.entries()) {
    modal.blocks.push(
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
          text: `${dayjs(schedule.startDate).format('YYYY-MM-DD')} ~ ${dayjs(schedule.endDate).format('YYYY-MM-DD')}`,
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
    );
    if (index !== schedules.length - 1) {
      modal.blocks.push({
        type: 'divider',
      });
    }
  }

  return modal;
};

export const userNotificationSelectModal = (chatUser : IChatUser) => {
  return {
    view: {
      title: '알림 ON/OFF',
      accept: '설정',
      decline: '취소',
      value: 'noti_on_off',
      blocks: [
        {
          type: 'label',
          text: '알림을 설정해주세요.' + (chatUser ? ` (현재: ${chatUser.allowNotification ? 'on' : 'off'})` : ''),
          markdown: false,
        },
        {
          type: 'select',
          name: 'value',
          required: true,
          options: [
            {
              text: '켜기',
              value: 'noti_on',
            },
            {
              text: '끄기',
              value: 'noti_off',
            },
          ],
          placeholder: '알림',
        },
      ],
    },
  };
};

export const userNotificationSelectResult = (value: boolean) => {
  return {
    text: '알림 ON/OFF',
    blocks: [
      {
        type: 'header',
        text: '💡 알림설정을 완료했어요.',
        style: 'blue',
      },
      {
        type: 'description',
        term: '알림',
        content: {
          type: 'text',
          text: `${value === true ? '켜기' : '끄기'}`,
          markdown: false,
        },
        accent: true,
      },
    ],
  };
};

export const reRequestModal = (conversationId: number) => {
  return {
    conversationId,
    text: '저어희는 크롤링을 하겠습니다. 거기에 소마를 곁들인',
    blocks: [
      {
        type: 'image_link',
        url: 'https://i.ibb.co/z8nnny6/chatbot-title.png',
      },
      {
        type: 'text',
        text: '*SWM Bot*',
        markdown: true,
      },
      {
        type: 'text',
        text: '또 다른 기능이 필요하지 않으세요? 아래의 메뉴를 선택해주세요 (๑>ᴗ<๑)',
        markdown: true,
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'user_search',
        text: '👩‍👦 멘티/멘토 검색',
        style: 'primary',
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'mentoring_search',
        text: '🔎 멘토링 검색',
        style: 'primary',
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'calendar',
        text: '📅 일정 확인',
        style: 'primary',
      },
      {
        type: 'button',
        action_type: 'call_modal',
        value: 'noti_on_off',
        text: '💡 신규 멘토링 알림 켜고 끄기',
        style: 'primary',
      },
    ],
  };
};
