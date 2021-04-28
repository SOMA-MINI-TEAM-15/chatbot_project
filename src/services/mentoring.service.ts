import { IMentoring } from '../interfaces/soma.interface';
import { Mentoring } from '../models/mentoring.model';
import { fetchMentoringByTypeAndQuery } from '../utils/crawler';

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
  const dbData = await Mentoring.find({ title: { $regex: title } })
    .sort({ id: -1 })
    .limit(limit);

  if (dbData) {
    return dbData;
  }

  return await fetchMentoringByTypeAndQuery('title', title);
}

export async function getMentoringsByContent(content: string, limit = 3): Promise<IMentoring[]> {
  const dbData = await Mentoring.find({ content: { $regex: content } })
    .sort({ id: -1 })
    .limit(limit);

  if (dbData) {
    return dbData;
  }

  return await fetchMentoringByTypeAndQuery('content', content);
}

export async function getMentoringsByWriter(writer: string, limit = 3): Promise<IMentoring[]> {
  const dbData = await Mentoring.find({ writer: { $regex: writer } })
    .sort({ id: -1 })
    .limit(limit);

  if (dbData) {
    return dbData;
  }

  return await fetchMentoringByTypeAndQuery('writer', writer);
}

export async function getMostRecentMentoring(): Promise<IMentoring> {
  return Mentoring.findOne().sort({ id: -1 });
}

export async function getMentorings(): Promise<IMentoring[]> {
  return Mentoring.find();
}
