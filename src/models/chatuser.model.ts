import { model, Schema, Document, Model } from 'mongoose';
import { IChatUser } from '../interfaces/soma.interface';

const chatUserSchema: Schema = new Schema<IChatUser & Document, Model<IChatUser & Document>>({
  userId: { type: String, required: true },
  allowNotification: { type: Boolean, default: false },
});

export const ChatUser = model<IChatUser & Document>('User', chatUserSchema);
