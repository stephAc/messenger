import Server from './Server';
import Database from './Database';
import Socket from './Socket';

const server = new Server();
const database = new Database();
new Socket(server.getServer());

database.getConnection().then(() => {
  console.log('Database connected');
  server.start();
});
