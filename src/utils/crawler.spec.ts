import 'dotenv/config';
import { fetchMentoringDetails, fetchMentorings, fetchSchedules, fetchSomaUsers, initialize } from './crawler';
describe('Crawler Test', () => {
  beforeAll(async () => {
    await initialize();
  });

  it('should fetch Mentees', async () => {
    const ret = await fetchSomaUsers();
    expect(ret.length).toBeGreaterThan(10);
    expect(ret[4].name).toEqual('최준성');
  });

  it('should fetch Mentors', async () => {
    const ret = await fetchSomaUsers('mentor');
    expect(ret.length).toBeGreaterThan(10);
    expect(ret[0].name).toEqual('임영재');
  });

  // it('should be fast', async () => {
  //   for (let i = 0; i < 20; i++) {
  //     const startTime = new Date();
  //     await fetchSomaUsers(i % 2 == 0 ? 'mentee' : 'mentor');
  //     const endTime = new Date();
  //     console.log(endTime.getTime() - startTime.getTime());
  //   }
  // });

  it('should return mentorings', async () => {
    const res = await fetchMentorings();
    expect(res.length).toEqual(10);
  });

  it('should return second page mentoring', async () => {
    const res = await fetchMentorings(2);
    expect(res[0].id).toEqual(635);
  });

  it('should return empty mentorings', async () => {
    const res = await fetchMentorings(100);
    expect(res.length).toEqual(0);
  });

  it('should fetch Mentoring Detail', async () => {
    const res = await fetchMentoringDetails(643);
    expect(res.mentoringLocation).toEqual('소마센터 6층 6회의실');
  });

  it('should fetch Schedule April', async () => {
    const res = await fetchSchedules(2021, 4);
    expect(res.length).toEqual(4);
    expect(res[0].title).toEqual('기술별 소모임(IoT-Embedded) 특강');
  });
  it('should fetch Schedule May', async () => {
    const res = await fetchSchedules(2021, 5);
    expect(res.length).toEqual(6);
    expect(res[0].title).toEqual('1차 소마 컨퍼런스');
  });
});
