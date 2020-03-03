import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Header,
  Image,
  Icon,
  Label,
  Dropdown,
} from 'semantic-ui-react';

import UserCard from './UserCard';
import Logo from '../assets/img/logo.png';
import NewConversationPopUp from './NewConversationPopUp';
import { SocketContext } from '../contexts/Socket.context';
import event from '../events/event';

const UserChatList = ({ user, conversations, setSelectedRoom }) => {
  let history = useHistory();
  const { socket } = useContext(SocketContext);

  const [newConversation, setNewConversation] = useState(false);

  const disconnect = () => {
    localStorage.removeItem('userID');
    localStorage.removeItem('token');
    socket.emit(event.USER_DISCONNECTED, { id: user._id });
    history.push('/');
  };

  return (
    <Container
      style={{
        overflow: 'auto',
        padding: 15,
        borderRight: '1px solid lightgray',
      }}
    >
      <NewConversationPopUp
        newConversation={newConversation}
        setNewConversation={setNewConversation}
        contacts={user.contacts}
        requestTo={user.requestTo}
        requestBy={user.requestBy}
      />
      <Header as="h4">
        <Image
          circular
          src={user.avatar !== '' ? user.avatar : Logo}
          size="mini"
        />{' '}
        {user.username}
        <Dropdown icon="setting">
          <Dropdown.Menu>
            <Dropdown.Item
              text="Profil"
              icon="user"
              onClick={() => history.push('/profil')}
            />
            <Dropdown.Item
              text="Log out"
              icon="power off"
              onClick={disconnect}
            />
          </Dropdown.Menu>
        </Dropdown>
        <Icon
          name="edit"
          size="tiny"
          style={{ float: 'right', cursor: 'pointer' }}
          onClick={() => setNewConversation(true)}
        />
        <Label
          color={user.requestBy.length ? 'red' : 'grey'}
          circular
          style={{ cursor: 'pointer' }}
          onClick={() => history.push('/contacts')}
        >
          <Icon name="users" /> {user.requestBy.length}
        </Label>
      </Header>
      <div
        style={{
          marginTop: 15,
          height: 'calc(100vh - 150px)',
          overflow: 'auto',
        }}
      >
        {conversations.length > 0 &&
          conversations.map(conv => (
            <div
              style={{
                margin: '20px 0 20px 0',
                cursor: 'pointer',
              }}
              key={conv._id}
              onClick={() => setSelectedRoom(conv)}
            >
              <UserCard
                avatar={conv.avatar}
                name={conv.name}
                contributors={conv.contributor}
                lastMessage={conv.messages[conv.messages.length - 1]}
                username={user.username}
              />
            </div>
          ))}
      </div>
    </Container>
  );
};

export default UserChatList;
