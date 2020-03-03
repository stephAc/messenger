import React, { Fragment, useContext, useState, useEffect } from 'react';

import Logo from '../assets/img/logo.png';
import background from '../assets/img/background.jpg';
import { UserContext } from '../contexts/User.context';
import { Icon } from 'semantic-ui-react';
import UserService from '../services/User.service';
import history from '../routes/history';
import '../assets/css/Profile.css';

const Profile = () => {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState({});
  const [tmpUserData, setTmpUserData] = useState({ username: '', email: '' });
  const [inputStateDisabled, setInputStateDisabled] = useState(true);

  const getUserData = async () => {
    await UserService.find(user.id).then(res =>
      res
        .json()
        .then(data => {
          console.log(data);
          setUserData(data.user);
          setTmpUserData(data.user);
        })
        .catch(err => console.log(err)),
    );
  };

  const handleInput = event => {
    let { name, value } = event.target;
    setTmpUserData({ ...tmpUserData, [name]: value });
  };

  const cancelInput = () => {
    setInputStateDisabled(true);
    setTmpUserData(userData);
  };

  const saveUser = () => {
    let obj = {};
    if (tmpUserData.email !== userData.email) {
      obj['email'] = tmpUserData.email;
    }
    if (tmpUserData.username !== userData.username) {
      obj['username'] = tmpUserData.username;
    }
    // Check if object is empty
    if (Object.keys(obj).length) {
      obj['id'] = user.id;
      UserService.update(obj).then(res =>
        res
          .json()
          .then(data => {
            setUserData(data);
            setTmpUserData(data);
            setInputStateDisabled(true);
          })
          .catch(err => console.log(err)),
      );
    } else {
      setInputStateDisabled(true);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Fragment>
      <div
        style={{
          height: 150,
          background: `url(${background}) no-repeat center center`,
          backgroundSize: 'cover',
        }}
      >
        <nav style={{ height: 50, padding: 15 }}>
          <Icon
            name="arrow left"
            size="large"
            style={{ color: 'white', cursor: 'pointer' }}
            onClick={() => history.push('/chatroom')}
          />
        </nav>
      </div>
      <img
        src={tmpUserData.avatar ? tmpUserData.avatar : Logo}
        style={{
          marginLeft: 30,
          marginTop: -100,
          height: 200,
          width: 200,
          borderRadius: '50%',
          border: '10px solid white',
        }}
      />
      <div
        style={{
          width: '50%',
          minWidth: 400,
          maxWidth: 600,
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 20,
          backgroundColor: 'lightgray',
          borderRadius: 10,
        }}
      >
        {inputStateDisabled && (
          <Icon
            name="edit"
            size="large"
            color="black"
            style={{ float: 'right', cursor: 'pointer' }}
            onClick={() => setInputStateDisabled(false)}
          />
        )}
        <p>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: 16,
              marginRight: 10,
              width: 100,
            }}
          >
            Username :
          </span>
          <input
            className={
              inputStateDisabled ? 'profileInputDisabled' : 'profileInputEnable'
            }
            type="text"
            value={tmpUserData.username}
            name="username"
            onChange={handleInput}
            disabled={inputStateDisabled}
          />
        </p>
        <p>
          <span
            style={{
              display: 'block',
              fontWeight: 'bold',
              fontSize: 16,
              marginRight: 10,
              width: 100,
            }}
          >
            Email :
          </span>
          <input
            className={
              inputStateDisabled ? 'profileInputDisabled' : 'profileInputEnable'
            }
            type="text"
            value={tmpUserData.email}
            name="email"
            onChange={handleInput}
            disabled={inputStateDisabled}
          />
        </p>
        {!inputStateDisabled && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="profileButtonSave" onClick={saveUser}>
              Save
            </button>
            <button className="profileButtonCancel" onClick={cancelInput}>
              cancel
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Profile;
