import { Router } from 'express';

import ConversationController from '../controllers/Conversation.controller';

const convRouter = Router();

convRouter.post('/create', ConversationController.create);
convRouter.get('/find/:id', ConversationController.findByUser);
convRouter.get('/find_by_user/:id', ConversationController.findByUser);

export default convRouter;
