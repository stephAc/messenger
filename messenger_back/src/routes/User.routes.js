import { Router } from 'express';

import UserController from '../controllers/User.controller';

const userRouter = Router();

userRouter.post('/find', UserController.find);
userRouter.get('/list/:name', UserController.list);
userRouter.get('/conversations/:id', UserController.getConversation);
userRouter.post('/request_to', UserController.requestTo);
userRouter.post('/decline_request', UserController.declineRequest);
userRouter.post('/accept_request', UserController.acceptRequest);
userRouter.post('/delete_contact', UserController.deleteContact);
userRouter.put('/update', UserController.update);

export default userRouter;
