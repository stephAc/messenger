import mongoose from 'mongoose';

const DATABASE_URl = 'mongodb://mongo:27017/messenger';

export default class Database {
  constructor() {
    mongoose.set('useCreateIndex', true);
  }

  getConnection() {
    return mongoose.connect(DATABASE_URl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}
