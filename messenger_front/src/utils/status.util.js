import history from '../routes/history';

export const status = status => {
  switch (status) {
    case 401:
      console.log('status', status);
      localStorage.removeItem('userID');
      localStorage.removeItem('token');
      history.push('/');
      break;

    case 404:
      history.push('/404');
      break;

    case 503:
      history.push('/service_unavailable');
      break;
    default:
      return;
  }
};
