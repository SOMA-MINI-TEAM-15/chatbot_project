import { NextFunction, Request, Response } from 'express';
import { KakaoWorkCallbackInfo, KakaoWorkConversation, KakaoWorkRequestInfo, KakaoWorkUserInfo } from '../dtos/kakaowork.dto';
import { IChatUser } from '../interfaces/soma.interface';
import { getMentoringsByContent, getMentoringsByTitle, getMentoringsByWriter } from '../services/mentoring.service';
import { fetchMentorings, fetchSchedules, fetchSomaUsers } from '../utils/crawler';
import * as kakaoWork from '../utils/kakaowork';
import {
  broadcastMessage,
  calendarRequestModal,
  calendarResultModal,
  mentoringSearchRequestModal,
  mentoringSearchResultModal,
  userSearchRequestModal,
  userSearchResultModal,
} from '../utils/kakaowork.message';

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
      const requestInfo: KakaoWorkRequestInfo = req.body;
      let responseModal;

      switch (requestInfo.value) {
        case 'user_search':
          responseModal = userSearchRequestModal();
          break;
        case 'mentoring_search':
          responseModal = mentoringSearchRequestModal();
          break;
        case 'calendar':
          responseModal = calendarRequestModal();
          break;
        case 'noti_on_off':
          console.log('on and off pressed');
        default:
          break;
      }

      res.status(200).json(responseModal);
    } catch (error) {
      next(error);
    }
  };

  public callbackController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const callbackInfo: KakaoWorkCallbackInfo = req.body;
      console.log(callbackInfo);
      // 추가 로직에서 데이터를 요청했을 때 처리(대표적으로 크롤링) 해서 보내기
      // 1. 유저 검색(멘토/멘티 선택 및 이름 기반 검색)
      // 2. 일정 검색(선택한 월로 검색)
      // 3. 멘토링 검색(제목, 작성자, 내용 기반 검색)
      // 4. 신규 멘토링 On/Off 기능 (유저 allowNotification만 반전)

      let responseModal;
      const { type, value } = callbackInfo.actions;
      switch (callbackInfo.value) {
        case 'user_search':
          if (type === 'mento') {
            const somaMentor = await (await fetchSomaUsers('mentor')).filter(user => user.name === value)[0];
            responseModal = userSearchResultModal(somaMentor.name, type, somaMentor.major.join(','));
          } else if (type === 'mentee') {
            const somaMentee = await (await fetchSomaUsers('mentee')).filter(user => user.name === value)[0];
            responseModal = userSearchResultModal(somaMentee.name, type, somaMentee.major.join(','));
          }
          break;
        case 'mentoring_search':
          let mentoringData;

          if (type === 'title') {
            mentoringData = await getMentoringsByTitle(value);
          } else if (type === 'content') {
            mentoringData = await getMentoringsByContent(value);
          } else if (type === 'writer') {
            mentoringData = await getMentoringsByWriter(value);
          }

          responseModal = mentoringSearchResultModal(mentoringData);
          break;
        case 'calendar':
          const schedules = await fetchSchedules(2021, +type);
          responseModal = calendarResultModal(+type, schedules);
          break;
        case 'noti_on_off':
          console.log('on and off pressed');
        default:
          break;
      }

      kakaoWork.sendMessage({
        conversationId: callbackInfo.message.conversation_id,
        text: responseModal.text,
        blocks: responseModal.blocks,
      });

      res.status(200).json(responseModal);
    } catch (error) {
      next(error);
    }
  };
}

export default ChatbotController;
