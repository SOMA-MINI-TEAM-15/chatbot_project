import { NextFunction, Request, Response } from 'express';
import { KakaoWorkConversation, KakaoWorkUserInfo } from '../dtos/kakaowork.dto';
import * as kakaoWork from '../utils/kakaowork';

class ChatbotController {
  public sendMessageToAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await kakaoWork.getUserList();
      const conversations = await Promise.all(users.map((user: KakaoWorkUserInfo) => kakaoWork.openConversations({ userId: user.id })));

      const messages = await Promise.all([
        conversations.map((conversation: KakaoWorkConversation) =>
          kakaoWork.sendMessage({
            conversationId: conversation.id,
            text: '설문조사 이벤트',
            blocks: [
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
            ],
          }),
        ),
      ]);

      res.status(200).json({ messages });
    } catch (error) {
      next(error);
    }
  };

  public requestController = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { message, value } = req.body as { [k in string]: string };

      // 모달에서 추가 로직을 요청했을 때 모달 보내기

      res.status(200).json({ message, value });
    } catch (error) {
      next(error);
    }
  };

  public callbackController = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { message, actions, action_time, value } = req.body;

      // 추가 로직에서 데이터를 요청했을 때 처리(대표적으로 크롤링) 해서 보내기

      res.status(200).json({ message, value });
    } catch (error) {
      next(error);
    }
  };
}

export default ChatbotController;
