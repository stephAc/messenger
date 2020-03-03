import User from '../models/User.model';
import mongoose from 'mongoose';

export default class UserController {
  static async find(req, res) {
    let status = 200;
    let body = {};

    try {
      let user = await User.findOne({
        _id: mongoose.Types.ObjectId(req.body.id),
      })
        .select('-password')
        .populate({
          path: 'conversationsRef',
          populate: {
            path: 'contributor',
            model: 'User',
            select: 'username avatar',
          },
        })
        .populate({
          path: 'requestTo',
          select: '-password',
        })
        .populate({
          path: 'requestBy',
          select: '-password',
        })
        .populate({
          path: 'contacts',
          select: '-password',
        });
      if (!user) {
        status = 401;
        throw { message: "User doesn't exist" };
      }
      user['password'] = undefined;
      body = { user };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'User Login',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
  static async list(req, res) {
    let status = 200;
    let body = {};

    try {
      console.log(req.params.name);
      const users =
        req.params.name === 'null'
          ? await User.find().select('-password')
          : await User.find({
              username: { $regex: '^' + req.params.name, $options: 'i' },
            }).select('-password');

      body = { users };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'User List',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }

  static async getConversation(req, res) {
    let status = 200;
    let body = {};

    try {
      const user = await User.findById({
        _id: mongoose.Types.ObjectId(req.params.id),
      })
        .select('conversationsRef')
        .populate({
          path: 'conversationsRef',
          populate: {
            path: 'contributor',
            model: 'User',
          },
        });

      if (!user) {
        status = 401;
        throw { message: "User doesn't exist" };
      }
      body = user.conversationsRef;
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'User List',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
  static async requestTo(req, res) {
    let status = 200;
    let body = {};

    try {
      const user = await User.findById({
        _id: mongoose.Types.ObjectId(req.body.to),
      });

      if (!user) {
        status = 401;
        throw { message: "User doesn't exist" };
      }

      await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.to) },
        { $push: { requestBy: req.body.by } },
        { useFindAndModify: false },
      );

      await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.by) },
        { $push: { requestTo: req.body.to } },
        { useFindAndModify: false },
      );

      body = { message: 'request sended' };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'RequesTo',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
  static async declineRequest(req, res) {
    let status = 200;
    let body = {};

    try {
      const user = await User.findById({
        _id: mongoose.Types.ObjectId(req.body.userID),
      });

      if (!user) {
        status = 401;
        throw { message: "User doesn't exist" };
      }

      const contact = await User.findById({
        _id: mongoose.Types.ObjectId(req.body.contactID),
      });

      if (!contact) {
        status = 401;
        throw { message: "Contact doesn't exist" };
      }

      await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.userID) },
        { $pullAll: { requestBy: [req.body.contactID] } },
        { useFindAndModify: false },
      );

      await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.contactID) },
        { $pullAll: { requestTo: [req.body.userID] } },
        { useFindAndModify: false },
      );

      body = { message: 'request finished' };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'Decline friend request',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
  static async acceptRequest(req, res) {
    let status = 200;
    let body = {};

    try {
      const user = await User.findById({
        _id: mongoose.Types.ObjectId(req.body.userID),
      });

      if (!user) {
        status = 401;
        throw { message: "User doesn't exist" };
      }

      let contact = await User.findById({
        _id: mongoose.Types.ObjectId(req.body.contactID),
      });

      if (!contact) {
        status = 401;
        throw { message: "Contact doesn't exist" };
      }

      await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.userID) },
        {
          $pullAll: { requestBy: [req.body.contactID] },
          $push: { contacts: [req.body.contactID] },
        },
        { useFindAndModify: false },
      );

      contact = await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.contactID) },
        {
          $pullAll: { requestTo: [req.body.userID] },
          $push: { contacts: [req.body.userID] },
        },
        { new: true, useFindAndModify: false },
      );

      body = { message: 'request finished', contact };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'Decline friend request',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
  static async deleteContact(req, res) {
    let status = 200;
    let body = {};

    try {
      const user = await User.findById({
        _id: mongoose.Types.ObjectId(req.body.userID),
      });

      if (!user) {
        status = 401;
        throw { message: "User doesn't exist" };
      }

      let contact = await User.findById({
        _id: mongoose.Types.ObjectId(req.body.contactID),
      });

      if (!contact) {
        status = 401;
        throw { message: "Contact doesn't exist" };
      }

      await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.userID) },
        {
          $pullAll: { contacts: [req.body.contactID] },
        },
        { useFindAndModify: false },
      );

      await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(req.body.contactID) },
        {
          $pullAll: { contacts: [req.body.userID] },
        },
        { useFindAndModify: false },
      );

      body = { message: 'request finished' };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'Decline friend request',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
  static async update(req, res) {
    let status = 200;
    let body = {};

    try {
      const user = await User.findByIdAndUpdate(
        {
          _id: mongoose.Types.ObjectId(req.body.id),
        },
        req.body,
        { new: true, useFindAndModify: false },
      ).select('-password');

      if (!user) {
        status = 401;
        throw { message: "User doesn't exist" };
      }
      body = { message: 'request finished', user };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'Decline update',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
  static async delete(req, res) {
    let status = 200;
    let body = {};

    try {
      const user = await User.findByIdAndRemove(
        {
          _id: mongoose.Types.ObjectId(req.body.id),
        },
        { useFindAndModify: false },
      );

      if (!user) {
        status = 401;
        throw { message: "User doesn't exist" };
      }
      body = { message: 'request finished', contact };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'Decline friend request',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
}
