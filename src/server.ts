import 'dotenv/config';
import App from './app';
import ChatbotRoute from './routes/chatbot.route';
import IndexRoute from './routes/index.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new ChatbotRoute()]);

app.listen();
