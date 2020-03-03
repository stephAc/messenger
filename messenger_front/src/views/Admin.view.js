import React, { useEffect, useState, useContext, Fragment } from 'react';

import UserService from '../services/User.service';
import { Card, Image, Icon } from 'semantic-ui-react';
import Logo from '../assets/img/logo.png';
import { status } from '../utils/status.util';
import history from '../routes/history';
import { UserContext } from '../contexts/User.context';

const Admin = () => {
  const { user } = useContext(UserContext);

  const [userList, setUserList] = useState([]);
  const [searchBar, setSearchBar] = useState('');

  const deleteUser = (username, id) => {
    const confirmedUsername = prompt('Confirmer le username à supprimer :', '');

    if (confirmedUsername === username) {
      UserService.delete(id).then(res => {
        res.status !== 200 && status(res.status);
        getAllUser();
      });
    }
  };

  const getAllUser = (name = 'null') => {
    console.log('getAll ', name);
    UserService.list(name, 'admin').then(res => {
      res.status !== 200 && status(res.status);
      res
        .json()
        .then(data => {
          console.log(data);
          setUserList(data.users);
        })
        .catch(err => {
          console.log(err);
        });
    });
  };

  useEffect(() => {
    searchBar === '' ? getAllUser() : getAllUser(searchBar);
  }, [searchBar]);

  const disconnect = () => {
    localStorage.removeItem('userID');
    localStorage.removeItem('token');
    history.push('/');
  };

  const handleEntree = event => {
    if (event.target.value !== '') {
      if (event.key === 'Enter' || event.type === 'click') {
        console.log('target value ', event.target.value);
        getAllUser(event.target.value);
      }
    }
  };

  return (
    <Fragment>
      <nav
        style={{
          height: 80,
          backgroundColor: '#0670f9',
          boxShadow: '0px 3px 3px lightgray',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 20,
        }}
      >
        <input
          style={{
            textAlign: 'left',
            border: 'none',
            borderRadius: 10,
            height: 40,
            width: 300,
            marginRight: 25,
            paddingLeft: 20,
            backgroundColor: 'white',
          }}
          type="text"
          value={searchBar}
          onChange={e => setSearchBar(e.target.value)}
          onKeyPress={handleEntree}
          placeholder="Search..."
        />
        <span style={{ cursor: 'pointer' }} onClick={disconnect}>
          <Icon
            name="power off"
            size="big"
            style={{ marginLeft: 20, color: '#cce2ff' }}
          />
        </span>
      </nav>

      <div
        style={{
          display: 'flex',
          width: '80%',
          flexWrap: 'wrap',
          justifyContent: 'center',
          margin: 'auto',
          marginTop: 50,
        }}
      >
        {userList.length > 0 ? (
          userList.map(
            el =>
              el._id !== user.id && (
                <Card key={el._id} style={{ margin: 10 }}>
                  <Card.Content>
                    <Image
                      floated="left"
                      size="massive"
                      avatar
                      src={el.avatar.length > 0 ? el.avatar : Logo}
                    />
                    <Card.Header>
                      {el.username}
                      <Icon
                        name="user delete"
                        onClick={() => deleteUser(el.username, el._id)}
                        style={{
                          float: 'right',
                          cursor: 'pointer',
                        }}
                      />
                    </Card.Header>
                  </Card.Content>
                </Card>
              ),
          )
        ) : (
          <div style={{ width: '100%', textAlign: 'center', fontSize: 16 }}>
            Aucun utilisateurs
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Admin;
