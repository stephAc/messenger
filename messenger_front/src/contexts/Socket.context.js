import React, { createContext, useState } from 'react';
import io from 'socket.io-client';

import { BASE_URL } from '../configs/Api.config';
import event from '../events/event';

export const SocketContext = createContext();

const SocketContextProvider = props => {
  const [socket, setSocket] = useState(() => {
    const userID = localStorage.getItem('userID');
    const soc = userID
      ? io(BASE_URL, { query: `userID=${userID}` })
      : io(BASE_URL, { query: '' });

    soc.on('disconnect', () => {
      const userID = localStorage.getItem('userID');

      soc.emit(event.USER_DISCONNECTED, () => console.log('test'));
      console.log('disconnect');
    });

    return soc;
  });

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
