import 'dotenv/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { logger } from './logger';

mongoose.Promise = global.Promise;

export const memoryDb = new MongoMemoryServer();

export const dbConnOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
};

export const connectMongoMemoryDb = async () => {
  const dbUri = await memoryDb.getUri();

  mongoose
    .connect(dbUri, dbConnOpts)
    .then(() => {
      logger.info(`*** Successfully connect MongoMemoryDB!`);
    })
    .catch(error => {
      logger.error(`[MongoMemoryConnectError] ${error}`);
    });
};
