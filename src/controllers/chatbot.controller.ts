import { NextFunction, Request, Response } from 'express';
import { KakaoWorkCallbackInfo, KakaoWorkConversation, KakaoWorkRequestInfo, KakaoWorkUserInfo } from '../dtos/kakaowork.dto';
import * as kakaoWork from '../utils/kakaowork';
import { broadcastMessage } from '../utils/kakaowork.message';

class ChatbotController {
  public sendMessageToAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await kakaoWork.getUserList();

      const conversations: KakaoWorkConversation[] = await Promise.all(
        users.map((user: KakaoWorkUserInfo) => kakaoWork.openConversations({ userId: user.id })),
      );

      const messages = await Promise.all([conversations.map(conversation => kakaoWork.sendMessage(broadcastMessage(conversation.id)))]);

      res.status(200).json({ users, conversations, messages });
    } catch (error) {
      next(error);
    }
  };

  public requestController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 최초 모달에서 기능을 요청했을 때 그에 맞는 모달 보내기

      const requestinfo: KakaoWorkRequestInfo = req.body;

      switch (requestinfo.value) {
        case 'user_search':
          console.log('user search pressed');
          break;
        case 'mentoring_search':
          console.log('mentoring search pressed');
          break;
        case 'monthly':
          console.log('monthly pressed');
          break;
        case 'noti_on_off':
          console.log('on and off pressed');
        default:
          break;
      }

      res.status(200).json({ message: 'request controller is alive ' });
    } catch (error) {
      next(error);
    }
  };

  public callbackController = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userInput: KakaoWorkCallbackInfo = req.body;

      // 추가 로직에서 데이터를 요청했을 때 처리(대표적으로 크롤링) 해서 보내기
      // 1. 유저 검색(멘토/멘티 선택 및 이름 기반 검색)
      // 2. 일정 검색(선택한 월로 검색)
      // 3. 멘토링 검색(제목, 작성자, 내용 기반 검색)
      // 4. 신규 멘토링 On/Off 기능 (유저 allowNotification만 반전)

      res.status(200).json({ message: userInput.message, value: userInput.value });
    } catch (error) {
      next(error);
    }
  };
}

export default ChatbotController;
