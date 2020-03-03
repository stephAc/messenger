import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';

import SocketContextProvider from './contexts/Socket.context';
import UserContextProvider from './contexts/User.context';
import Routes from './routes/router';

const Router = () => (
  <SocketContextProvider>
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  </SocketContextProvider>
);

ReactDOM.render(<Router />, document.getElementById('root'));
