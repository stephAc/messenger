import { Router } from 'express';

import UserRoutes from './User.routes';
import AuthRoutes from './Auth.routes';
import ConversationRouter from './Conversation.routes';
import AdminRouter from './Admin.routes';
import {
  adminCredential,
  clientCredential,
} from '../middleware/credentials.middelware';

export default class Routes {
  constructor() {
    this._router = Router();

    this._router.use('/user', clientCredential, UserRoutes);
    this._router.use('/auth', AuthRoutes);
    this._router.use('/conversation', clientCredential, ConversationRouter);
    this._router.use('/admin', adminCredential, AdminRouter);

    this._router.use((req, res) =>
      res.status(404).send({ message: 'Route not found' }),
    );
  }

  getRouter() {
    return this._router;
  }
}
