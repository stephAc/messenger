import { Router } from 'express';

import AuthController from '../controllers/Auth.controller';

const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/create', AuthController.create);

export default authRouter;
