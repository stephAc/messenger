import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/User.model';
import { JWT_SECRET } from '../config/secret.config';
import { role } from '../enum/role.enum';

export async function adminCredential(req, res, next) {
  const { user, token } = await getToken(req, res);

  try {
    if (user.role !== role.admin) {
      throw { message: 'Unauthorized admin' };
    }
    if (user.session_token !== token) {
      throw { message: 'Unauthorized: token difference' };
    }
    next();
  } catch (err) {
    res.status(401).json(err.message);
  }
}
export async function clientCredential(req, res, next) {
  const { user, token } = await getToken(req, res);
  try {
    if (user.role !== role.client) {
      throw { message: 'Unauthorized client' };
    }
    if (user.session_token !== token) {
      throw { message: 'Unauthorized: token difference' };
    }
    next();
  } catch (err) {
    res.status(401).json(err.message);
  }
}

async function getToken(req, res) {
  try {
    const token = req.headers.authorization.replace(/Bearer /g, '');
    const userID = jwt.verify(token, JWT_SECRET);
    const user = await User.findById({
      _id: mongoose.Types.ObjectId(userID.id),
    }).select('-password');

    return { user, token };
  } catch (err) {
    console.log(err);
  }
}
