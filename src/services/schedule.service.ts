import { ISchedule } from '../interfaces/soma.interface';
import { fetchSchedules } from '../utils/crawler';

export async function getSchedulesStartYearMonthOf(year: number, month: number): Promise<ISchedule[]> {
  return fetchSchedules(year, month);
}
