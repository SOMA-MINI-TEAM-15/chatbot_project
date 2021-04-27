import { Router } from 'express';
import ChatbotController from '../controllers/chatbot.controller';
import Route from '../interfaces/routes.interface';

class ChatbotRoute implements Route {
  public path = '/chatbot';
  public router = Router();
  public chatbotController = new ChatbotController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, this.chatbotController.sendMessageToAllUsers);
    this.router.post(`${this.path}/request`, this.chatbotController.requestController);
    this.router.post(`${this.path}/callback`, this.chatbotController.callbackController);
  }
}

export default ChatbotRoute;
