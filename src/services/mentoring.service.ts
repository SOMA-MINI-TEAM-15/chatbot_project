import { IMentoring } from '../interfaces/soma.interface';
import { Mentoring } from '../models/mentoring.model';

export async function addMentoring(mentoring: IMentoring): Promise<IMentoring> {
  return Mentoring.create(mentoring);
}

export async function updateMentoring(mentoring: IMentoring): Promise<IMentoring> {
  return Mentoring.findOneAndUpdate({ id: mentoring.id }, mentoring);
}

export async function getMentoringById(id: number): Promise<IMentoring> {
  return Mentoring.findOne({ id });
}

export async function getMostRecentMentoring(): Promise<IMentoring> {
  return Mentoring.findOne().sort({ id: -1 });
}

export async function getMentorings(): Promise<IMentoring[]> {
  return Mentoring.find();
}
