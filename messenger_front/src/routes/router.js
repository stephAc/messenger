import React from 'react';
import { Router, Route } from 'react-router-dom';

import history from './history';
import Main from '../views/Main.view';
import Authentification from '../views/Authentification.view';
import Register from '../views/Register.view';
import Contacts from '../views/Contacts.view';
import Admin from '../views/Admin.view';
import Profile from '../views/Profile.view';

const Routes = () => (
  <Router history={history}>
    <Route exact path="/" component={Authentification} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/chatroom" component={Main} />
    <Route exact path="/contacts" component={Contacts} />
    <Route exact path="/admin" component={Admin} />
    <Route exact path="/profil" component={Profile} />
  </Router>
);

export default Routes;
