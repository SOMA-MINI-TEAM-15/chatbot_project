import 'dotenv/config';
import { initialize } from '../utils/crawler';

import { getSchedulesStartYearMonthOf } from './schedule.service';

describe('Mentoring Service', () => {
  beforeAll(async () => {
    await initialize();
  });
  it('should getSchedule of April', async () => {
    const res = await getSchedulesStartYearMonthOf(2021, 4);
    expect(res.length).toEqual(4);
  });
});
