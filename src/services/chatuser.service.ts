import HttpException from '../exceptions/HttpException';
import { IChatUser } from '../interfaces/soma.interface';
import { ChatUser } from '../models/chatuser.model';

export async function addChatUser(chatUser: IChatUser): Promise<IChatUser> {
  return ChatUser.create(chatUser);
}

export async function updateChatUser(chatUser: IChatUser): Promise<IChatUser> {
  return ChatUser.findOneAndUpdate({ userId: chatUser.userId }, chatUser);
}

export async function getChatUserById(userId: string): Promise<IChatUser> {
  return ChatUser.findOne({ userId });
}

export async function flipChatUserNoti(userId: string): Promise<IChatUser> {
  const targetUser = await ChatUser.findOne({ userId });

  if (!targetUser) {
    return await ChatUser.create({ userId, allowNotification: false });
  }

  return ChatUser.findOneAndUpdate({ userId }, { allowNotification: !targetUser.allowNotification }, { returnOriginal: false });
}

// 주의: DB내 사용자 전체를 가져오는것이지 카카오 웍스 워크스페이스의 전체 사용자를 가져오는건 아님
export async function getChatUsers(): Promise<IChatUser[]> {
  return ChatUser.find();
}
