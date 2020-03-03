import SocketIO from 'socket.io';

import events from './events/events';
import User from './models/User.model';
import Conversation from './models/Conversation.model';
import mongoose from 'mongoose';

export default class Socket {
  constructor(server) {
    this._io = SocketIO.listen(server);
    this._io.origins('*:*');

    /**
     * Get socket connection on page launch/refresh
     * Set socket to user if log in case of a refresh
     * Make user join rooms
     * @param {Request} socket
     * @param {Request} user id - if user refresh page
     * @param {Response} res
     */
    this._io.on('connection', async socket => {
      let userID = socket.handshake.query.userID;
      console.log('Handshake Query User ID: ', socket.handshake.query.userID);
      console.log('User connect on socket : ', socket.id);

      if (userID) {
        try {
          const userRooms = await User.findByIdAndUpdate(
            {
              _id: mongoose.Types.ObjectId(userID.toString()),
            },
            { $set: { socketID: socket.id, online: true } },
            { new: true, useFindAndModify: false },
          )
            .select('conversationsRef')
            .populate('conversationsRef');

          // joining user room
          if (userRooms.conversationsRef !== null) {
            for (const room of userRooms.conversationsRef) {
              socket.join(room._id);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }

      // --------------------- Events ------------------------ //
      /**
       * Set socket to user
       * Make user join rooms
       * Emit to contacts to signal online status
       * @param {Request} User ID
       * @param {Request} user id - if user refresh page
       * @param {Response} action: emit
       */
      socket.on(events.USER_LOG_IN, async data => {
        try {
          const user = await User.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(data) },
            { $set: { socketID: socket.id, online: true } },
            { new: true, useFindAndModify: false },
          )
            .select('username conversationsRef contacts')
            .populate('conversationsRef')
            .populate('contacts');

          console.log('Event LOG_IN : ', user.username);
          // joining user room
          if (user.conversationsRef !== null) {
            for (const room of user.conversationsRef) {
              socket.join(room._id);
            }
          }
          user.contacts.map(
            el =>
              el.online && this._io.to(el.socketID).emit(events.RELOAD_DATA),
          );
        } catch (err) {
          console.log(err);
        }
      });
      /**
       * Save message to conversation
       * Emit to room to signal new message
       * @param {Request} conversation ID - message - sender ID
       * @param {Response} action : emit, payload: the new conversation
       */
      socket.on(events.MESSAGE_SENT, async data => {
        try {
          const newConv = await Conversation.findByIdAndUpdate(
            { _id: mongoose.Types.ObjectId(data.conversationID) },
            {
              $push: {
                messages: { content: data.message, sender: data.userID },
              },
            },
            { new: true, useFindAndModify: false },
          ).populate({
            path: 'contributor',
            model: 'User',
            select: 'username avatar',
          });
          socket.join(newConv._id);

          // EMIT TO ROOM
          this._io
            .in(data.conversationID)
            .emit(events.MESSAGE_RECEIVED, newConv);
        } catch (err) {
          console.log(err);
        }
      });
      /**
       * Detect user typing in room
       * @param {Request} conversation ID
       * @param {Response} action : emit, payload: conversation ID
       */
      socket.on(events.IS_TYPING, data => {
        socket
          .to(data.conversationID)
          .emit(events.IS_TYPING, data.conversationID);
      });
      /**
       * Detect user finished typing in room
       * @param {Request} conversation ID
       * @param {Response} action : emit, payload: conversation ID
       */
      socket.on(events.FINISH_TYPING, data => {
        socket
          .to(data.conversationID)
          .emit(events.FINISH_TYPING, data.conversationID);
      });
      /**
       * Initiate new conversation
       * @param {Request} conversation ID - initiator ID
       * @param {Response} action : emit, payload: conversation - initiator ID
       */
      socket.on(events.NEW_CONVERSATION, async data => {
        try {
          const conv = await Conversation.findById({
            _id: mongoose.Types.ObjectId(data.convID),
          }).populate({
            path: 'contributor',
            model: 'User',
            select: 'username avatar',
          });
          let tmpUser = null;
          if (conv) {
            if (
              conv.contributor.length === 2 &&
              conv.contributor[0] === conv.contributor[1]
            ) {
              tmpUser = await User.findById({
                _id: mongoose.Types.ObjectId(conv.contributor[0]._id),
              }).select('online socketID username');

              this._io.to(tmpUser.socketID).emit(events.NEW_CONVERSATION, {
                conv,
                userCreateID: data.userCreateID,
              });
            } else {
              conv.contributor.map(async el => {
                tmpUser = await User.findById({
                  _id: mongoose.Types.ObjectId(el._id),
                }).select('online socketID username');
                if (tmpUser.online) {
                  this._io.to(tmpUser.socketID).emit(events.NEW_CONVERSATION, {
                    conv,
                    userCreateID: data.userCreateID,
                  });
                }
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      });

      socket.on(events.JOIN_CONVERSATION, data => {
        socket.join(data.conversationID);
      });
      /**
       * Send friend request
       * @param {Request} receiver ID - sender ID
       * @param {Response} action : emit
       */
      socket.on(events.REQUEST_TO, async data => {
        const contact = await User.findById({
          _id: mongoose.Types.ObjectId(data.to),
        });
        if (contact.online) {
          this._io.to(contact.socketID).emit(events.RELOAD_DATA);
        }
      });
      /**
       * Accept friend request
       * @param {Request} contact ID
       * @param {Response} action : emit
       */
      socket.on(events.NEW_FRIEND, async data => {
        const contact = await User.findById({
          _id: mongoose.Types.ObjectId(data.id),
        });
        if (contact.online) {
          this._io.to(contact.socketID).emit(events.RELOAD_DATA);
        }
      });
      /**
       * Delete friend
       * @param {Request} contact ID
       * @param {Response} action : emit
       */
      socket.on(events.DELETE_FRIEND, async data => {
        const contact = await User.findById({
          _id: mongoose.Types.ObjectId(data.id),
        });
        if (contact.online) {
          this._io.to(contact.socketID).emit(events.RELOAD_DATA);
        }
      });
      /**
       * Disconnection - signal to all contacts online
       * @param {Request} user ID
       * @param {Response} action : emit
       */
      socket.on(events.USER_DISCONNECTED, async data => {
        console.log('userID', data.id);
        if (data.id) {
          try {
            const userContacts = await User.findByIdAndUpdate(
              {
                _id: mongoose.Types.ObjectId(data.id.toString()),
              },
              { $set: { socketID: '', online: false } },
              { new: true, useFindAndModify: false },
            )
              .select('contacts')
              .populate({
                path: 'contacts',
                model: 'User',
                select: 'online socketID',
              });

            userContacts.contacts.map(
              el =>
                el.online && this._io.to(el.socketID).emit(events.RELOAD_DATA),
            );
          } catch (err) {
            console.log(err);
          }
        }
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
        await User.findByIdAndUpdate(
          {
            socketID: socket.id,
          },
          { $set: { online: false } },
          { new: true, useFindAndModify: false },
        )
          .select('contacts')
          .populate({
            path: 'contacts',
            model: 'User',
            select: 'online socketID',
          });
        console.log(socket.id);
        userContacts.contacts.map(
          el =>
            el.online && this._io.to(el.socketID).emit(events.RELOAD_DATA),
        );
      });
    });
  }
}
