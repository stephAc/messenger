import { Router } from 'express';

import UserController from '../controllers/User.controller';

const adminRouter = Router();

adminRouter.get('/list/:name', UserController.list);
adminRouter.post('/delete', UserController.delete);

export default adminRouter;
