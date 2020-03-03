import React, { useState, useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';

import Logo from '../assets/img/logo.png';
import AuthService from '../services/Auth.service';
import { SocketContext } from '../contexts/Socket.context';
import events from '../events/event';
import { UserContext } from '../contexts/User.context';

const LoginForm = () => {
  const { socket } = useContext(SocketContext);
  const { dispatch } = useContext(UserContext);

  const history = useHistory();
  const [login, setLogin] = useState({ email: '', password: '' });
  const [form, setForm] = useState({
    showErrMsg: 'none',
    loading: false,
  });

  const handleInput = event => {
    let { name, value } = event.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setForm({ ...form, loading: true });

    let { email, password } = login;

    const fetchResponse = AuthService.login({ email, password });
    fetchResponse.then(res => {
      if (res.status === 200) {
        res
          .json()
          .then(data => {
            localStorage.setItem('token', data.token);
            dispatch({ type: 'ADD_ID', user: { id: data.id } });
            socket.emit(events.USER_LOG_IN, data.id);
            socket.emit(events.USER_CONNECTED, data.id);
            data.role === 'client'
              ? history.push('/chatroom')
              : history.push('/admin');
          })
          .catch(err => console.log(err));
      } else if (res.status === 401) {
        setForm({ showErrMsg: 'block', loading: false });
      }
    });
  };

  return (
    <Grid textAlign="center" style={{ height: '100vh' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          <Image src={Logo} /> React Messenger
        </Header>
        <Form size="large" onSubmit={handleSubmit} loading={form.loading}>
          <Message
            style={{ display: form.showErrMsg, width: '100%' }}
            error
            header="Action Forbidden"
            content="Wrong email or password"
          />
          <Segment stacked>
            <Form.Input
              fluid
              type="text"
              icon="mail"
              name="email"
              iconPosition="left"
              placeholder="E-mail"
              value={login.email}
              onChange={handleInput}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              name="password"
              placeholder="Password"
              type="password"
              value={login.password}
              onChange={handleInput}
            />

            <Button color="teal" fluid size="large" type="submit">
              Login
            </Button>
          </Segment>
        </Form>
        <Message style={{ width: '100%' }}>
          New to us ? <Link to="/register">Sign Up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
