import React, { useEffect, useState, useContext, Fragment } from 'react';
import { useHistory } from 'react-router-dom';

import UserAddCard from '../components/UserAddCard';
import UserService from '../services/User.service';
import { UserContext } from '../contexts/User.context';
import { Header, Icon } from 'semantic-ui-react';
import { SocketContext } from '../contexts/Socket.context';
import events from '../events/event';

const Contacts = () => {
  let history = useHistory();
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const [userData, setUserData] = useState({
    conversationsRef: [],
    contacts: [],
    requestTo: [],
    requestBy: [],
  });

  const getUserData = () => {
    UserService.find(user.id).then(res =>
      res
        .json()
        .then(data => setUserData(data.user))
        .catch(err => console.log(err)),
    );
  };

  const onDecline = contactID => {
    UserService.declineRequest({ userID: user.id, contactID })
      .then(() => {
        let requestBy = userData.requestBy.filter(el => el._id !== contactID);
        setUserData(prevState => ({ ...prevState, requestBy }));
      })
      .catch(err => console.log(err));
  };
  const onAccept = contactID => {
    UserService.acceptRequest({ userID: user.id, contactID }).then(res =>
      res
        .json()
        .then(data => {
          let requestBy = userData.requestBy.filter(el => el._id !== contactID);
          setUserData(prevState => ({
            ...prevState,
            requestBy,
            contacts: [data.contact, ...prevState.contacts],
          }));
          socket.emit(events.NEW_FRIEND, { id: contactID });
        })
        .catch(err => console.log(err)),
    );
  };
  const onDelete = contactID => {
    UserService.deleteContact({ userID: user.id, contactID })
      .then(() => {
        let contacts = userData.contacts.filter(el => el._id !== contactID);
        setUserData(prevState => ({ ...prevState, contacts }));
        socket.emit(events.DELETE_FRIEND, { id: contactID });
      })
      .catch(err => console.log(err));
  };
  const setSocket = () => {
    socket.on(events.REQUEST_BY, () => {
      getUserData();
    });
    socket.on(events.NEW_FRIEND, () => {
      getUserData();
    });
    socket.on(events.DELETE_FRIEND, () => {
      getUserData();
    });
  };

  useEffect(() => {
    getUserData();
    setSocket();
  }, []);

  return (
    <Fragment>
      <nav
        style={{
          height: 80,
          backgroundColor: '#0670f9',
          boxShadow: '0px 3px 3px lightgray',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => history.push('/chatroom')}
        >
          <Icon
            name="arrow left"
            size="large"
            style={{ color: '#cce2ff', marginLeft: 20 }}
          />
        </span>
      </nav>
      <div
        style={{
          width: '90%',
          marginRight: 'auto',
          marginLeft: 'auto',
          margin: '30px auto 0px auto',
          boxShadow:
            '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
          padding: 50,
        }}
      >
        <Header as="h2" icon textAlign="center" style={{ paddingTop: 20 }}>
          <Icon name="users" circular />
          <Header.Content>Friends</Header.Content>
        </Header>
        <Header as="h4">
          <Icon name="user plus" />
          <Header.Content>Friend request</Header.Content>
        </Header>
        <div style={{ display: 'flex', padding: 10 }}>
          {userData.requestBy.length > 0 &&
            userData.requestBy.map(contact => (
              <UserAddCard
                key={contact._id}
                id={contact._id}
                avatar={contact.avatar}
                username={contact.username}
                onDecline={onDecline}
                onAccept={onAccept}
                context="add"
              />
            ))}
        </div>
        <Header as="h4">
          <Icon name="users" />
          <Header.Content>Friends</Header.Content>
        </Header>
        <div style={{ display: 'flex', padding: 10 }}>
          {userData.contacts.length > 0 &&
            userData.contacts.map(contact => (
              <UserAddCard
                key={contact._id}
                id={contact._id}
                avatar={contact.avatar}
                username={contact.username}
                onDecline={onDecline}
                onAccept={onAccept}
                context="friend"
                onDelete={onDelete}
              />
            ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Contacts;
