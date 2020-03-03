import React, { useState, useEffect, useContext, Fragment } from 'react';

import UserChatList from '../components/UserChatList';
import ChatRoom from '../components/ChatRoom';
import UserService from '../services/User.service';
import { UserContext } from '../contexts/User.context';
import { SocketContext } from '../contexts/Socket.context';
import events from '../events/event';
import { Image, Icon } from 'semantic-ui-react';

let tmpConv = [];
let tmpSelectedRoom = '';
const Main = () => {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const [userData, setUserData] = useState({
    conversationsRef: [],
    contacts: [],
    requestTo: [],
    requestBy: [],
  });
  const [conversations, setConversations] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const getUserData = async () => {
    await UserService.find(user.id).then(res =>
      res
        .json()
        .then(data => {
          console.log(data);
          setConversations(data.user.conversationsRef);
          tmpConv = data.user.conversationsRef;
          setUserData(data.user);
        })
        .catch(err => console.log(err)),
    );
  };

  const setSocket = () => {
    socket.on(events.MESSAGE_RECEIVED, data => {
      tmpConv = tmpConv.filter(conversation => conversation._id !== data._id);
      tmpConv.unshift(data);
      setConversations(tmpConv);
      if (tmpSelectedRoom !== null) {
        if (tmpSelectedRoom._id === data._id) {
          setSelectedRoom(data);
        }
      }
    });

    socket.on(events.NEW_CONVERSATION, data => {
      setConversations(prevConv => [data.conv, ...prevConv]);
      socket.emit(events.JOIN_CONVERSATION, { conversationID: data.conv._id });
      if (data.userCreateID === user.id) {
        setSelectedRoom(data.conv);
      }
    });

    socket.on(events.RELOAD_DATA, () => getUserData());
  };

  useEffect(() => {
    getUserData();
    setSocket();
  }, []);
  useEffect(() => {
    tmpSelectedRoom = selectedRoom;
  }, [selectedRoom]);

  return (
    <Fragment>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            userData.contacts.length > 0 ? '100px 300px auto' : ' 300px auto',
          height: '100vh',
        }}
      >
        {userData.contacts.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRight: '1px solid lightgray',
            }}
          >
            {userData.contacts.map(el => (
              <div key={el._id} style={{ marginTop: 10, textAlign: 'center' }}>
                <Image
                  src={el.avatar}
                  style={{
                    border: el.online ? '5px solid green' : '5px solid gray',
                    borderRadius: '50%',
                    width: 80,
                  }}
                />
                <p style={{ fontWeight: 'bold', fontSize: 20 }}>
                  {el.username}{' '}
                  <Icon
                    name="dot circle"
                    color={el.online ? 'green' : 'grey'}
                  />
                </p>
              </div>
            ))}
          </div>
        )}
        <UserChatList
          user={userData}
          conversations={conversations}
          getUserData={getUserData}
          setSelectedRoom={setSelectedRoom}
        />
        <ChatRoom selectedRoom={selectedRoom} />
      </div>
    </Fragment>
  );
};

export default Main;
