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
        value: 'selectMenu',
        text: '챗봇 사용해보기',
        style: 'default',
      },
    ],
  };
};

export const userSearchMessage = (name: string, skills: string) => {
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
