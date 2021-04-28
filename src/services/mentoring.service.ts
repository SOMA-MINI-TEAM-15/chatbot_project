import { IMentoring } from '../interfaces/soma.interface';
import { MentoringModel } from '../models/mentoring.model';

export async function addMentoring(mentoring: IMentoring): Promise<IMentoring> {
  return MentoringModel.create(mentoring);
}

export async function getMentoringById(id: number): Promise<IMentoring> {
  return MentoringModel.findOne({ id });
}

export async function getMostRecentMentoring(): Promise<IMentoring> {
  return MentoringModel.findOne().sort({ id: -1 });
}
