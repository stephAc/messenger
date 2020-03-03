import React, { createContext, useReducer, useEffect } from 'react';

import { UserReducer } from '../reducers/User.reducer';

export const UserContext = createContext();

const UserContextProvider = props => {
  const [user, dispatch] = useReducer(UserReducer, {}, () => {
    const userID = localStorage.getItem('userID');
    return userID ? { id: userID } : { id: '' };
  });

  useEffect(() => {
    localStorage.setItem('userID', user.id);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
