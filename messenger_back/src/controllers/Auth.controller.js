import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/User.model';
import { JWT_SECRET } from '../config/secret.config';

export default class Auth {
  /**
   * Login user
   * @param {Request} email - password
   * @param {Response} err : 401 => Unautirized
   * @param {Response} token - id - message
   */
  static async login(req, res) {
    let status = 200;
    let body = {};

    try {
      const user = await User.findOne({ email: req.body.email });
      if (user && (await bcrypt.compare(req.body.password, user.password))) {
        let token = jwt.sign({ id: user._id }, JWT_SECRET);
        await User.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(user._id) },
          { $set: { session_token: token } },
          { new: true, useFindAndModify: false },
        );

        let role = user.role === 20 ? 'client' : 'admin';
        body = { token, id: user._id, role, message: 'User Loged' };
      } else {
        status = 401;
        throw { message: 'Unauthorized Login / Password' };
      }
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'User Login',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
  /**
   * Create user
   * @param {Request} username - email - password
   * @param {err} 400 - message[]
   * @param {Response} message
   */
  static async create(req, res) {
    let status = 200;
    let body = {};
    let message = [];

    try {
      if (!req.body.email) {
        message.push('Email incorrect');
      } else if ((await User.find({ email: req.body.email })).length) {
        message.push('Email already exist');
      }
      if (!req.body.username) {
        message.push('Username incorrect');
      } else if ((await User.find({ username: req.body.username })).length) {
        message.push('Username already exist');
      }
      if (!req.body.password) {
        message.push('Password incorrect');
      }

      if (message.length) {
        status = 400;
        throw { error: 'User Creation', message };
      }

      let { username, email, password } = req.body;
      password = await bcrypt.hash(password, 12);

      await User.create({
        username,
        email,
        password,
      });

      body = { message: 'User created' };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'User Creation',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
}
