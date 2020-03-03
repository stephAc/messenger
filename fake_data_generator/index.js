const faker = require('faker');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./User.model');

mongoose.set('useCreateIndex', true);
mongoose
  .connect('mongodb://localhost:27017/messenger', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Database connected');
    let password = (await bcrypt.hash('root', 10)).toString();

    await User.create({
      username: 'admin',
      email: 'admin',
      avatar: faker.internet.avatar(),
      password,
      role: 30,
    });

    await User.create({
      username: 'root',
      email: 'root',
      avatar: faker.internet.avatar(),
      password,
    });

    await User.create({
      username: 'test1',
      email: 'test1',
      avatar: faker.internet.avatar(),
      password,
    });

    await User.create({
      username: 'test2',
      email: 'test2',
      avatar: faker.internet.avatar(),
      password,
    });

    let user = null;

    for (let index = 0; index < 25; index++) {
      console.log(faker.internet.avatar());
      user = await User.create({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.internet.avatar(),
        password,
      });
      console.log(user);
    }
    process.exit();
  });
