import { getUserList, getUserPartialList, getTeam15UserList } from './kakaowork';

describe('Kakaowork', () => {
  it('should getUserPartialList', async () => {
    const res = await getUserPartialList({ limit: 100 });
    const res2 = await getUserPartialList({ cursor: res.cursor });

    expect(res.users.length).toEqual(100);
    expect(res2.users.length).toBeGreaterThan(10);
  });

  it('should getUserList', async () => {
    const ret = await getUserList();
    expect(ret.length).toBeGreaterThan(150);
    console.log(ret);
  });

  it('should get Our Team List', async () => {
    const ret = await getTeam15UserList();
    expect(ret.length).toEqual(5);
  });
});
