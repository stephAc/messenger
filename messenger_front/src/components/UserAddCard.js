import React from 'react';
import { Image, Header } from 'semantic-ui-react';

const UserAddCard = ({
  id,
  avatar,
  username,
  onDecline,
  onAccept,
  onDelete,
  context,
}) => (
  <div
    style={{
      display: 'flex',
      boxShadow:
        '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
      margin: 10,
    }}
  >
    <Image size="tiny" src={avatar} />
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 10,
      }}
    >
      <Header as="h3">{username}</Header>
      <div style={{ marginTop: 'auto' }}>
        {context === 'add' && (
          <button
            style={{
              border: 'none',
              background: 'inherit',
              fontSize: 'bold',
              fontSize: 16,
              marginRight: 5,
              cursor: 'pointer',
            }}
            onClick={() => onDecline(id)}
          >
            Decline
          </button>
        )}
        <button
          style={{
            background: 'inherit',
            border: '2px solid #006097',
            padding: '5px 15px 5px 15px',
            color: '#006097',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={context === 'add' ? () => onAccept(id) : () => onDelete(id)}
        >
          {context === 'add' ? 'Approve' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

export default UserAddCard;
