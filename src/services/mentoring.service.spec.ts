import 'dotenv/config';
import { connectMongoDb } from '../utils/mongoDB';
import { getMentoringById, getMentoringsByWriter, getMostRecentMentoring, getMentoringsByContent, getMentoringsByTitle } from './mentoring.service';

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
    expect(mentoring.id).toEqual(645);
  });

  it('should getMentoringsByWriter', async () => {
    const mentoring = await getMentoringsByWriter('최원서');
    expect(mentoring[0].writer).toEqual('최원서');
  });

  it('should getMentoringsByContent', async () => {
    const mentoring = await getMentoringsByContent('AI');
    expect(mentoring.length).toEqual(3);
  });

  it('should getMentoringsByTitle', async () => {
    const mentoring = await getMentoringsByTitle('백엔드');
    expect(mentoring[0].id).toEqual(575);
  });
});
