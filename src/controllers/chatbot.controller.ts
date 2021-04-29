import { NextFunction, Request, Response } from 'express';
import { KakaoWorkCallbackInfo, KakaoWorkConversation, KakaoWorkRequestInfo, KakaoWorkUserInfo } from '../dtos/kakaowork.dto';
import { addChatUser, flipChatUserNoti, getChatUsers } from '../services/chatuser.service';
import { getMentoringsByContent, getMentoringsByTitle, getMentoringsByWriter } from '../services/mentoring.service';
import { fetchSchedules, fetchSomaUsers, sleepPromise } from '../utils/crawler';
import * as kakaoWork from '../utils/kakaowork';
import {
  broadcastMessage,
  calendarRequestModal,
  calendarResultModal,
  userNotificationSelectModal,
  mentoringSearchRequestModal,
  mentoringSearchResultModal,
  userSearchRequestModal,
  userSearchResultModal,
  userNotificationSelectResult,
  reRequestModal,
} from '../utils/kakaowork.message';

class ChatbotController {
  public sendMessageToAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await kakaoWork.getUserList();
      const dbUsers = await (await getChatUsers()).map(user => user.userId);
      const conversations: KakaoWorkConversation[] = await Promise.all(
        users.map((user: KakaoWorkUserInfo) => {
          if (!dbUsers.includes(user.id)) {
            addChatUser({ userId: user.id, allowNotification: true });
          }

          return kakaoWork.openConversations({ userId: user.id });
        }),
      );

      const messages = await Promise.all([conversations.map(conversation => kakaoWork.sendMessage(broadcastMessage(conversation.id)))]);

      res.status(200).json({ users, conversations, messages });
    } catch (error) {
      next(error);
    }
  };

  public sendMessageToTeam15 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await kakaoWork.getTeam15UserList();
      const dbUsers = await (await getChatUsers()).map(user => user.userId);
      const conversations: KakaoWorkConversation[] = await Promise.all(
        users.map((user: KakaoWorkUserInfo) => {
          if (!dbUsers.includes(user.id)) {
            addChatUser({ userId: user.id, allowNotification: true });
          }

          return kakaoWork.openConversations({ userId: user.id });
        }),
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
          responseModal = userNotificationSelectModal();
          break;
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
      const { type, value } = callbackInfo.actions;
      let responseModal;

      switch (callbackInfo.value) {
        case 'user_search':
          if (type === 'mento') {
            const somaMentor = await (await fetchSomaUsers('mentor')).filter(user => user.name === value);
            responseModal = userSearchResultModal(type, somaMentor);
          } else if (type === 'mentee') {
            const somaMentee = await (await fetchSomaUsers('mentee')).filter(user => user?.name.includes(value));
            responseModal = userSearchResultModal(type, somaMentee);
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
          const result = await flipChatUserNoti(callbackInfo.react_user_id.toString(), callbackInfo.actions.value);
          responseModal = userNotificationSelectResult(result.allowNotification);
          break;
        default:
          break;
      }

      await kakaoWork.sendMessage({
        conversationId: callbackInfo.message.conversation_id,
        text: responseModal.text,
        blocks: responseModal.blocks,
      });

      res.status(200).json(responseModal);

      await sleepPromise(2500);
      const menuModal = reRequestModal(callbackInfo.message.conversation_id);
      await kakaoWork.sendMessage({
        conversationId: callbackInfo.message.conversation_id,
        text: menuModal.text,
        blocks: menuModal.blocks,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ChatbotController;
