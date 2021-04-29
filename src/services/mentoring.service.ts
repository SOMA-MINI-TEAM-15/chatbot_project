import { KakaoWorkConversation, KakaoWorkUserInfo } from '../dtos/kakaowork.dto';
import { IMentoring } from '../interfaces/soma.interface';
import { ChatUser } from '../models/chatuser.model';
import { Mentoring } from '../models/mentoring.model';
import { fetchMentoringByTypeAndQuery } from '../utils/crawler';
import * as Kakaowork from '../utils/kakaowork';
import { newLectureModal } from '../utils/kakaowork.message';

export async function addMentoring(mentoring: IMentoring): Promise<IMentoring> {
  return Mentoring.create(mentoring);
}

export async function updateMentoring(mentoring: IMentoring): Promise<IMentoring> {
  return Mentoring.findOneAndUpdate({ id: mentoring.id }, mentoring);
}

export async function getMentoringById(id: number): Promise<IMentoring> {
  return Mentoring.findOne({ id });
}

export async function getMentoringsByTitle(title: string, limit = 3): Promise<IMentoring[]> {
  const dbData = await Mentoring.find({ title: { $regex: title } })
    .sort({ id: -1 })
    .limit(limit);

  if (dbData) {
    return dbData;
  }

  return await fetchMentoringByTypeAndQuery('title', title);
}

export async function getMentoringsByContent(content: string, limit = 3): Promise<IMentoring[]> {
  const dbData = await Mentoring.find({ content: { $regex: content } })
    .sort({ id: -1 })
    .limit(limit);

  if (dbData) {
    return dbData;
  }

  return await fetchMentoringByTypeAndQuery('content', content);
}

export async function getMentoringsByWriter(writer: string, limit = 3): Promise<IMentoring[]> {
  const dbData = await Mentoring.find({ writer: { $regex: writer } })
    .sort({ id: -1 })
    .limit(limit);

  if (dbData) {
    return dbData;
  }

  return await fetchMentoringByTypeAndQuery('writer', writer);
}

export async function getMostRecentMentoring(): Promise<IMentoring> {
  return Mentoring.findOne().sort({ id: -1 });
}

export async function getMentorings(): Promise<IMentoring[]> {
  return Mentoring.find();
}

export async function sendNewMentoringNotification(newMentoring: IMentoring): Promise<void> {
  const users = await Kakaowork.getUserList();
  const dbUsers = await (await ChatUser.find({ allowNotification: true })).map(user => user.userId);
  const conversations: KakaoWorkConversation[] = await Promise.all(
    users.filter(user => dbUsers.includes(user.id)).map((user: KakaoWorkUserInfo) => Kakaowork.openConversations({ userId: user.id })),
  );

  // 이미 바뀐것을 인지했으므로 다시 크롤링 하지 않도록 변경 필요
  // const newMentoring = await fetchMentorings(1);

  await Promise.all([conversations.map(conversation => Kakaowork.sendMessage(newLectureModal(conversation.id, newMentoring)))]);
}
