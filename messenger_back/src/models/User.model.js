import { Schema, model } from 'mongoose';

import { role } from '../enum/role.enum';

const UserSchema = new Schema(
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
    session_token: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
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
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
      },
      { default: [] },
    ],
    requestBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      { default: [] },
    ],
    requestTo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      { default: [] },
    ],
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      { default: [] },
    ],
  },
  { timestamps: true },
);

export default model('User', UserSchema);
