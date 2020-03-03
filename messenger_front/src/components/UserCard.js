import React from 'react';
import { Image } from 'semantic-ui-react';

import Logo from '../assets/img/logo.png';

const UserCard = ({ contributors, username, lastMessage, avatar, name }) => {
  if (contributors.length === 2) {
    if (contributors[0]._id === contributors[1]._id) {
      name = contributors[0].username;
      avatar = contributors[0].avatar;
    } else {
      contributors = contributors.filter(
        contributor => contributor.username !== username,
      );
      name = contributors[0].username;
      avatar = avatar.length ? avatar : contributors[0].avatar;
    }
  } else {
    name = !name.length
      ? contributors
          .map(el => el.username)
          .join(' - ')
          .replace(/(.{30})..+/, '$1...')
      : name;
    avatar = !avatar.length ? Logo : avatar;
  }

  return (
    <div
      style={{
        display: 'flex',
        padding: 10,
        borderBottom: '1px solid lightgray',
      }}
    >
      <div style={{ marginRight: 15 }}>
        <Image avatar src={avatar} size="mini" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 'bold', fontSize: 15 }}>{name}</span>
        {lastMessage && (
          <span style={{ marginLeft: 5 }}>{lastMessage.content}</span>
        )}
      </div>
    </div>
  );
};

export default UserCard;
