import React, { useState, useEffect, useContext } from 'react';
import { Header, Container, Icon } from 'semantic-ui-react';

import { SocketContext } from '../contexts/Socket.context';
import events from '../events/event';
import { UserContext } from '../contexts/User.context';
import '../assets/css/ChatRoom.css';
import '../assets/css/dotsAnimation.css';

const ChatRoom = ({ selectedRoom }) => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);

  const [message, setMessage] = useState('');
  const [typingConvId, setTypingConvId] = useState([]);

  const updateScroll = () => {
    var element = document.getElementById('scrollBox');
    element.scrollTop = element.scrollHeight;
  };
  useEffect(() => {
    setSocket();
  }, []);

  useEffect(() => {
    updateScroll();
  }, [selectedRoom]);

  useEffect(() => {
    setMessage('');
  }, [selectedRoom !== null && selectedRoom._id]);

  const setSocket = () => {
    socket.on(events.IS_TYPING, data => {
      setTypingConvId(prevState => [data, ...prevState]);
      updateScroll();
    });
    socket.on(events.FINISH_TYPING, data => {
      setTypingConvId(prevState => prevState.filter(id => id !== data));
      updateScroll();
    });
  };

  const handleTyping = event => {
    const { value } = event.target;

    const sendEvent = value.length ? events.IS_TYPING : events.FINISH_TYPING;

    socket.emit(sendEvent, {
      conversationID: selectedRoom._id,
      userID: user.id,
    });

    setMessage(value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (message.length) {
      socket.emit(events.FINISH_TYPING, {
        conversationID: selectedRoom._id,
        userID: user.id,
      });
      socket.emit(events.MESSAGE_SENT, {
        conversationID: selectedRoom._id,
        message,
        userID: user.id,
      });
      setMessage('');
    }
  };

  let roomName = '';
  if (selectedRoom !== null) {
    if (
      selectedRoom.contributor.length === 2 &&
      selectedRoom.contributor[0]._id === selectedRoom.contributor[1]._id
    ) {
      roomName = selectedRoom.contributor[0].username;
    } else {
      roomName = !selectedRoom.name.length
        ? (roomName = selectedRoom.contributor
            .map(el => el.username)
            .join(' - '))
        : selectedRoom.name;
    }
  }

  return (
    <Container style={{ backgroundColor: 'lightgray', width: '100%' }}>
      <Header
        style={{
          height: 80,
          backgroundColor: '#0670f9',
          padding: 15,
          color: '#cce2ff',
        }}
        as="h1"
      >
        {roomName}
      </Header>
      <div className="chatRoom" id="scrollBox">
        {selectedRoom !== null &&
          selectedRoom.messages.length > 0 &&
          selectedRoom.messages.map((message, index) => (
            <div key={index} style={{ marginBottom: 5 }}>
              <p
                className={
                  'message ' + (message.sender === user.id ? 'me' : 'other')
                }
              >
                {message.content}
              </p>
            </div>
          ))}
        {selectedRoom !== null &&
          typingConvId.length > 0 &&
          typingConvId.includes(selectedRoom._id) && (
            <div id="wave">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
      </div>
      {selectedRoom !== null && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 25,
          }}
        >
          <input
            style={{
              height: 50,
              border: 'none',
              borderRadius: 15,
              width: '80%',
              paddingLeft: 12,
            }}
            type="text"
            placeholder="Message..."
            name="message"
            value={message}
            onChange={handleTyping}
          />
          <button
            type="submit"
            style={{
              border: 'none',
              borderRadius: '50%',
              backgroundColor: 'white',
              marginLeft: 5,
              cursor: 'pointer',
            }}
          >
            <Icon name="send" size="large" />
          </button>
        </form>
      )}
    </Container>
  );
};

export default ChatRoom;
