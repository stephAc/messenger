import { Schema, model } from 'mongoose';

const ConversationSchema = new Schema(
  {
    name: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    contributor: [
      { type: Schema.Types.ObjectId, ref: 'User' },
      { default: [] },
    ],
    messages: [
      {
        content: String,
        sender: String,
      },
      { default: [] },
      { timestamps: true },
    ],
    updateAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default model('Conversation', ConversationSchema);
