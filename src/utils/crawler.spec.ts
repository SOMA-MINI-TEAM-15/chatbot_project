import 'dotenv/config';
import { fetchMentorings, initialize } from './crawler';
describe('Crawler Test', () => {
  beforeAll(async () => {
    await initialize();
  });
  it('should return mentorings', async () => {
    const res = await fetchMentorings();
    expect(res.length).toEqual(10);
    console.log(res);
  });
});
