import { model, Schema, Document } from 'mongoose';
import { UserDto } from '../dtos/user.dto';

const userSchema: Schema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['mento', 'mentee'], required: true },
  name: { type: String, required: true },
  skills: { type: String },
  allowNotification: { type: Boolean, default: true },
});

const userModel = model<UserDto & Document>('User', userSchema);

export default userModel;
