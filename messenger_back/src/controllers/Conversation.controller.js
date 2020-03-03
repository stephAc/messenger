import User from '../models/User.model';
import Conversation from '../models/Conversation.model';
import mongoose from 'mongoose';

export default class ConversationController {
  static async create(req, res) {
    let status = 200;
    let body = {};
    let message = [];
    let newConv = null;
    let tmpConv = null;

    try {
      for (const id of req.body.ids) {
        let user = await User.findById({ _id: mongoose.Types.ObjectId(id) });
        if (!user) {
          status = 401;
          message.push("User doesn't exist");
          throw { error: 'Conversation Creation', message };
        }
      }

      // If grp conv, create directly
      if (req.body.ids.length > 2) {
        req.body.ids = [...new Set(req.body.ids)];
        newConv = await Conversation.create({
          name: req.body.grpName || '',
          contributor: req.body.ids,
        });
      } else {
        // Check if conversation between the two partys already exist
        tmpConv = await Conversation.find({
          contributor: [req.body.ids[0], req.body.ids[1]],
        });
        if (!tmpConv.length) {
          tmpConv = await Conversation.find({
            contributor: [req.body.ids[1], req.body.ids[0]],
          });

          if (!tmpConv.length) {
            newConv = await Conversation.create({
              name: '',
              avatar: '',
              contributor: req.body.ids,
            });
          } else {
            status = 302;
            message.push('Conversation exist');
            throw { error: 'Conversation Creation', message };
          }
        } else {
          status = 302;
          message.push('Conversation exist');
          throw { error: 'Conversation Creation', message };
        }
      }

      // Check if sender is sending message to himself
      if (req.body.ids[0] === req.body.ids[1]) {
        await User.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(req.body.ids[0]) },
          { $push: { conversationsRef: newConv._id } },
          { useFindAndModify: false },
        );
      } else {
        for (const id of req.body.ids) {
          await User.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            { $push: { conversationsRef: newConv._id } },
            { useFindAndModify: false },
          );
        }
      }

      body = { newConv, message: 'Conversation created' };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'Conversation Creation',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
  static async findByUser(req, res) {
    let status = 200;
    let body = {};
    let message = [];

    try {
      let user = await User.findById({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (!user) {
        status = 404;
        message.push("User doesn't exist");
        throw { error: 'Conversation ', message };
      }

      // Check if conversation between the two partys already exist
      const conv = await Conversation.find({
        contributor: { $all: [req.params.id] },
      });

      body = { conv };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'Conversation Creation',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
  static async find(req, res) {
    let status = 200;
    let body = {};
    let message = [];

    try {
      let conv = await Conversation.findById({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      if (!conv) {
        status = 404;
        message.push("Conv doesn't exist");
        throw { error: 'Conversation ', message };
      }

      body = { conv };
    } catch (err) {
      status = status !== 200 ? status : 500;
      body = {
        error: err.error || 'Conversation Creation',
        message: err.message || 'Une erreur est survenue',
      };
    }
    res.status(status).json(body);
  }
}
