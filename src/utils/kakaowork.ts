import 'dotenv/config';
import axios from 'axios';

const kakaoInstance = axios.create({
  baseURL: 'https://api.kakaowork.com',
  headers: {
    Authorization: `Bearer ${process.env.KAKAOWORK_API_KEY}`,
  },
});

export const getUserPartialList = async (params: { limit?: number; cursor?: string }) => {
  const res: { data: { cursor?: string; users: any[] } } = await kakaoInstance.get('/v1/users.list', { params });
  return res.data;
};

const getUserList = async () => {
  let res = await getUserPartialList({ limit: 100 });
  const users: any[] = res.users;
  while (res.cursor !== null) {
    res = await getUserPartialList({ cursor: res.cursor });
    res.users.forEach(u => users.push(u));
  }
  return users;
};

export const getTeam15UserList = async () => {
  const users = await getUserList();
  const teamNames = ['정승욱', '박태형', '손승열', '윤여준', '이종민'];
  return users.filter(u => teamNames.includes(u.name));
};

const openConversations = async ({ userId }) => {
  const data = {
    user_id: userId,
  };
  const res = await kakaoInstance.post('/v1/conversations.open', data);
  return res.data.conversation;
};

const sendMessage = async ({ conversationId, text, blocks }) => {
  const data = {
    conversation_id: conversationId,
    text,
    ...(blocks && { blocks }),
  };
  const res = await kakaoInstance.post('/v1/messages.send', data);
  return res.data.message;
};

export { getUserList, openConversations, sendMessage };
