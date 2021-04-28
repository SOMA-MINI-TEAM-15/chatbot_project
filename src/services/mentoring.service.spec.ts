import 'dotenv/config';
import { connectMongoDb } from '../utils/mongoDB';
import { getMentoringById, getMostRecentMentoring } from './mentoring.service';

describe('Mentoring Service', () => {
  beforeAll(async () => {
    await connectMongoDb();
  });

  it('should getMentoringById', async () => {
    const mentoring = await getMentoringById(615);
    expect(mentoring.id).toEqual(615);
  });
  it('should getMostRecentMentoring', async () => {
    const mentoring = await getMostRecentMentoring();
    expect(mentoring.id).toEqual(642);
  });
});
