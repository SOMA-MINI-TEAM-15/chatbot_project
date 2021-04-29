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
    // this.router.post(`${this.path}/request`, this.chatbotController.requestController);
    // this.router.post(`${this.path}/callback`, this.chatbotController.callbackController);
    this.router.post(`/request`, this.chatbotController.requestController);
    this.router.post(`/callback`, this.chatbotController.callbackController);
    this.router.post(`${this.path}`, this.chatbotController.sendMessageToAllUsers);
    this.router.post('/teambot', this.chatbotController.sendMessageToTeam15);
  }
}

export default ChatbotRoute;
