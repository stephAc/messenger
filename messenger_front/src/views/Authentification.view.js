import React from 'react';
import { Grid, Image } from 'semantic-ui-react';

import Login from '../components/Login';
import HomeImage from '../assets/img/home.jpg';

const Authentification = () => {
  return (
    <Grid divided="vertically">
      <Grid.Row columns={2}>
        <Grid.Column>
          <Login />
        </Grid.Column>
        <Grid.Column style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <Image src={HomeImage} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Authentification;
