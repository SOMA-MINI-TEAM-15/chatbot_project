import { model, Model, Schema, Document } from 'mongoose';
import { IMentoring } from '../interfaces/soma.interface';

const MentoringSchema = new Schema<IMentoring & Document, Model<IMentoring & Document>>({
  id: {
    type: Number,
    unique: true,
    required: true,
    index: true,
  },
  title: String,
  state: String,
  createdAt: Date,
  mentoringDate: Date,
  appliedCnt: Number,
  writer: String,
  applyStartDate: Date,
  applyEndDate: Date,
  mentoringLocation: String,
  content: String,
});

export const MentoringModel = model('Mentoring', MentoringSchema);
