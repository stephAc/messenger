import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import Router from './routes/Router';

export default class Server {
  constructor(port = 5000) {
    this._port = process.env.PORT || port;
    this._app = express();
    this.setAppMiddleware();
    this.setAppRoutes();
    this._server = http.createServer(this._app);
  }

  getServer() {
    return this._server;
  }

  setAppMiddleware() {
    this._app.use(bodyParser.urlencoded({ extended: false }));
    this._app.use(bodyParser.json());
    this._app.use(cors({ origin: true }));
    this._app.use(express.static('public'));
  }

  setAppRoutes() {
    this._app.use(new Router().getRouter());
  }

  start() {
    this._server.listen(this._port, () => {
      console.log(`Server listening on port ${this._port}`);
    });
  }
}
