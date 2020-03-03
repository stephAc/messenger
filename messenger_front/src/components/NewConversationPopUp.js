import React, { useState, useEffect, useContext } from 'react';
import { Modal, Icon, Card, Image, Button, Input } from 'semantic-ui-react';

import UserService from '../services/User.service';
import ConversationService from '../services/Conversation.service';
import Logo from '../assets/img/logo.png';
import events from '../events/event';
import { UserContext } from '../contexts/User.context';
import { SocketContext } from '../contexts/Socket.context';
import { status } from '../utils/status.util';
import '../assets/css/CheckBox.css';
import '../assets/css/SearchBar.css';

const NewConversationPopUp = ({
  newConversation,
  setNewConversation,
  contacts,
  requestTo,
  requestBy,
}) => {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const [userList, setUserList] = useState([]);
  const [searchBar, setSearchBar] = useState('');
  const [selectedUser, setSelectedUser] = useState([]);
  const [grpName, setGrpName] = useState('');
  const [friendsRequest, setFriendsRequest] = useState([]);

  const getAllUser = (name = 'null') => {
    UserService.list(name).then(res => {
      console.log('res stat', res);
      res.status !== 200 && status(res.status);
      res
        .json()
        .then(data => {
          setUserList(data.users);
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  const addUserToRoom = (event, user) => {
    if (event.target.checked) {
      setSelectedUser([...selectedUser, user]);
    } else {
      const list = selectedUser.filter(el => el._id !== user._id);
      setSelectedUser(list);
    }
  };
  const removeUserFromRoom = userID => {
    const list = selectedUser.filter(el => el._id !== userID);
    setSelectedUser(list);
  };

  const closePopUp = () => {
    setNewConversation(false);
    setSelectedUser([]);
    setGrpName('');
  };

  const handleNewConversation = () => {
    if (selectedUser.length >= 1) {
      let ids = [user.id];
      for (const it of selectedUser) {
        ids.push(it._id);
      }
      // To avoid user adding himself to grp conv
      if (ids.length >= 3) {
        ids = [...new Set(ids)];
      }
      let body = {
        ids,
        grpName,
      };
      ConversationService.create(body).then(res =>
        res
          .json()
          .then(res => {
            socket.emit(events.NEW_CONVERSATION, {
              convID: res.newConv._id,
              userCreateID: user.id,
            });
            closePopUp();
          })
          .catch(err => console.log(err)),
      );
    }
  };

  const addContact = async contactID => {
    if (!friendsRequest.includes(contactID)) {
      await UserService.requestTo({ to: contactID, by: user.id }).then(res =>
        res
          .json()
          .then(() => {
            socket.emit(events.REQUEST_TO, { to: contactID, by: user.id });
            setFriendsRequest(prevState => [contactID, ...prevState]);
          })
          .catch(err => console.log(err)),
      );
    }
  };

  const handleEntree = event => {
    if (event.target.value !== '') {
      if (event.key === 'Enter' || event.type === 'click') {
        console.log('target value ', event.target.value);
        getAllUser(event.target.value);
      }
    }
  };

  useEffect(() => {
    searchBar === '' ? getAllUser() : getAllUser(searchBar);
  }, [searchBar]);

  return (
    <Modal open={newConversation} centered={false}>
      <Modal.Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        Create new conversation
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '50%',
            justifyContent: 'flex-end',
          }}
        >
          <input
            className="searchBar"
            type="text"
            value={searchBar}
            onChange={e => setSearchBar(e.target.value)}
            onKeyPress={handleEntree}
            placeholder="Search..."
          />
          <Icon
            name="x"
            size="large"
            style={{ float: 'right', cursor: 'pointer' }}
            onClick={closePopUp}
          />
        </div>
      </Modal.Header>
      <Modal.Content>
        {selectedUser.length > 0 &&
          selectedUser.map((el, index) => (
            <span
              key={index}
              style={{
                border: '1px solid black',
                padding: '10px 0 10px 10px',
                borderRadius: 20,
                marginRight: 10,
                display: 'inline-block',
              }}
            >
              {el.username}
              <Icon
                name="x"
                onClick={() => removeUserFromRoom(el._id)}
                style={{ marginLeft: 10 }}
              />
            </span>
          ))}
      </Modal.Content>
      <Modal.Content style={{ height: 500, overflow: 'auto' }}>
        <Card.Group>
          {userList.length > 0 ? (
            userList.map(el => (
              <Card fluid key={el._id}>
                <Card.Content>
                  <Image
                    floated="left"
                    size="massive"
                    avatar
                    src={el.avatar.length > 0 ? el.avatar : Logo}
                  />
                  <Card.Header>{el.username}</Card.Header>
                  <input
                    checked={selectedUser.includes(el)}
                    style={{ float: 'right' }}
                    type="checkbox"
                    className="option-input checkbox"
                    onChange={event => addUserToRoom(event, el)}
                  />
                  {contacts.filter(con => con._id === el._id).length === 0 &&
                    requestTo.filter(req => req._id === el._id).length === 0 &&
                    requestBy.filter(req => req._id === el._id).length === 0 &&
                    user.id !== el._id && (
                      <Icon
                        color={
                          friendsRequest.includes(el._id) ? 'green' : 'black'
                        }
                        name="add user"
                        onClick={() => addContact(el._id)}
                        style={{
                          float: 'right',
                          cursor: 'pointer',
                          marginRight: 20,
                        }}
                      />
                    )}
                </Card.Content>
              </Card>
            ))
          ) : (
            <div style={{ width: '100%', textAlign: 'center', fontSize: 16 }}>
              Aucun utilisateurs
            </div>
          )}
        </Card.Group>
      </Modal.Content>
      <Modal.Content>
        {selectedUser.length > 2 && (
          <Input
            type="text"
            icon="users"
            iconPosition="left"
            label="Group Name"
            fluid
            value={grpName}
            onChange={event => setGrpName(event.target.value)}
          />
        )}
        <Button
          floated="right"
          color="green"
          style={{ marginBottom: 10, marginTop: 25 }}
          onClick={handleNewConversation}
        >
          start
        </Button>
      </Modal.Content>
    </Modal>
  );
};

export default NewConversationPopUp;
