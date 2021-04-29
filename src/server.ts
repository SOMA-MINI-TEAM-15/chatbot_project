import 'dotenv/config';
import App from './app';
import ChatbotRoute from './routes/chatbot.route';
import IndexRoute from './routes/index.route';
import { initialize } from './utils/crawler';
import { logger } from './utils/logger';
import validateEnv from './utils/validateEnv';

validateEnv();

initialize()
  .then(() => {
    const app = new App([new IndexRoute(), new ChatbotRoute()]);
    app.listen();
  })
  .catch((error: Error) => logger.error(error));
