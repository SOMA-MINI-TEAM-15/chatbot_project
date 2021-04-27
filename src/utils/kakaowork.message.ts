export const sendMessageToAllUsersFormat = {
  text: '일괄 메세지 발송',
  blocks: [
    {
      type: 'header',
      text: '💡 일괄 메세지 보내기',
      style: 'blue',
    },
    {
      type: 'text',
      text: '연수생들에게 *일괄 메세지*를 전송해 나의 생각을 공유해보세요!',
      markdown: true,
    },
    {
      type: 'button',
      text: '내용 작성하기',
      style: 'default',
    },
  ],
};

export const votes = [
  {
    type: 'header',
    text: '☕ 사내 카페 만족도 조사 🥤',
    style: 'blue',
  },
  {
    type: 'text',
    text:
      '어느덧 사내카페가 바뀐지 한달이 되었습니다.\n구르미들이 카페를 이용하고 계신지 의견을 들어보고자 설문 조사를 진행해봅니다!!\n설문에 참여하면 푸짐한 경품 찬스가있으니 상품 꼭 받아가세요! 🎁',
    markdown: true,
  },
  {
    type: 'button',
    action_type: 'call_modal',
    value: 'cafe_survey',
    text: '설문 참여하기',
    style: 'default',
  },
];
