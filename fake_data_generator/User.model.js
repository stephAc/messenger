const mongoose = require('mongoose');

const role = {
  admin: 30,
  client: 20,
};

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    socketID: {
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    session_token: {
      type: String,
      default: '',
    },
    role: {
      type: Number,
      default: role.client,
    },
    online: {
      type: Boolean,
      default: false,
    },
    conversationsRef: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
      },
      { default: [] },
    ],
    requestBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      { default: [] },
    ],
    requestTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      { default: [] },
    ],
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      { default: [] },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
