import 'dotenv/config';
import { fetchMentorings, initialize } from './crawler';
describe('Crawler Test', () => {
  beforeAll(async () => {
    await initialize();
  });
  it('should return mentorings', async () => {
    const res = await fetchMentorings();
    expect(res.length).toEqual(10);
    // console.log(res);
  });
  it('should return second page mentoring', async () => {
    const res = await fetchMentorings(2);
    expect(res[0].id).toEqual(630);
  });
  it('should return empty mentorings', async () => {
    const res = await fetchMentorings(100);
    console.log(res);
    expect(res.length).toEqual(0);
  });
});
