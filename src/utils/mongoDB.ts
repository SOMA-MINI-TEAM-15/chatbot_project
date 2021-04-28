import 'dotenv/config';
import mongoose from 'mongoose';
import { logger } from './logger';

mongoose.Promise = global.Promise;

export const dbConnOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
};

export const connectMongoDb = async () => {
  return mongoose
    .connect(process.env.MONGO_URI, dbConnOpts)
    .then(() => {
      logger.info(`*** Successfully connect MongoDB!`);
    })
    .catch(error => {
      logger.error(`[MongoConnectError] ${error}`);
    });
};
