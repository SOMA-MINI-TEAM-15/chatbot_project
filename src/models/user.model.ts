import { model, Schema, Document } from 'mongoose';
import { UserDto } from '../dtos/user.dto';

const userSchema: Schema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  skills: [{ type: String }],
  allowNotification: { type: Boolean, default: false },
});

const userModel = model<UserDto & Document>('User', userSchema);

export default userModel;
