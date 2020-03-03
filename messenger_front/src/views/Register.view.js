import React, { useState } from 'react';
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

const Register = () => {
  const history = useHistory();
  const [login, setLogin] = useState({ username: '', email: '', password: '' });
  const [form, setForm] = useState({
    showErrMsg: 'none',
    loading: false,
    message: [],
  });

  const handleInput = event => {
    let { name, value } = event.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setForm({ ...form, loading: true });

    let { username, email, password } = login;

    AuthService.create({ username, email, password }).then(res => {
      if (res.status === 200) {
        history.push('/');
      } else if (res.status === 400) {
        res.json().then(data => {
          setForm({
            showErrMsg: 'block',
            loading: false,
            message: data.message,
          });
        });
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
            list={form.message}
          />
          <Segment stacked>
            <Form.Input
              fluid
              type="text"
              icon="user"
              name="username"
              iconPosition="left"
              placeholder="Username"
              value={login.username}
              onChange={handleInput}
            />
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
          Have an account?
          <Link to="/">Sign In</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
