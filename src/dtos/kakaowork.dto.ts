/**
 *  { avatar_url: null,
    department: null,
    id: '2632844',
    identifications: [ [Object] ],
    mobiles: [],
    name: 'taypark',
    nickname: null,
    position: null,
    responsibility: null,
    space_id: '147769',
    tels: [],
    vacation_end_time: null,
    vacation_start_time: null,
    work_end_time: null,
    work_start_time: null }
 */

export class KakaoWorkUserInfo {
  id: string; // userId
  name: string;
}

/**
 * {
 *  action_time: '2021-04-26T17:39:47.573530Z',
    message: { 
      blocks: [ [Object], [Object], [Object] ],
      conversation_id: 1150461,
      id: 306846483207471100,
      text: null,
      user_id: 2632878
    },
    react_user_id: 2632844,
    type: 'request_modal',
    value: 'cafe_survey' }
 */
export class KakaoWorkRequestInfo {
  action_time: string;
  message: KakaoWorkChatMessageFormat;
  react_user_id: number;
  type: string;
  value: string;
}
/**
 *  
{
  action_time: '2021-04-28T16:17:18.678971Z',
  actions: { type: 'mentee', value: '박태형' },
  message: {
    blocks: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    conversation_id: 1150461,
    id: 307550530646433800,
    text: null,
    user_id: 2632878
  },
  react_user_id: 2632844,
  type: 'submission',
  value: 'user_search'
}
 */
export class KakaoWorkCallbackInfo {
  message: KakaoWorkChatMessageFormat;
  actions: KakaoWorkCallbackActions;
  react_user_id: number;
  type: string;
  value: string;
}

export class KakaoWorkCallbackActions {
  type: string;
  value: string;
}

export class KakaoWorkChatMessageFormat {
  blocks: any;
  conversation_id: number;
  id: number;
  text: string;
  user_id: number;
}

// [
//   {
//     avatar_url: null,
//     id: '1150461',
//     name: 'taypark',
//     type: 'dm',
//     users_count: 2
//   }
// ]
export class KakaoWorkConversation {
  id: number;
  name: string;
  type: string;
  users_count: number;
}
