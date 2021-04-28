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

export async function getMentoringsByTitle(title: string, limit = 3): Promise<IMentoring[]> {
  return Mentoring.find({ title: { $regex: title } })
    .sort({ id: -1 })
    .limit(limit);
}

export async function getMentoringsByContent(content: string, limit = 3): Promise<IMentoring[]> {
  return Mentoring.find({ content: { $regex: content } })
    .sort({ id: -1 })
    .limit(limit);
}

export async function getMentoringsByWriter(writer: string, limit = 3): Promise<IMentoring[]> {
  return Mentoring.find({ writer: { $regex: writer } })
    .sort({ id: -1 })
    .limit(limit);
}

export async function getMostRecentMentoring(): Promise<IMentoring> {
  return Mentoring.findOne().sort({ id: -1 });
}

export async function getMentorings(): Promise<IMentoring[]> {
  return Mentoring.find();
}
