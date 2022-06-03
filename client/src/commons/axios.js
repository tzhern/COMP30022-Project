import _axios from 'axios';

// Having the online Heroku link with our web app and the localhost connection
const axios = () => {
  const instance = _axios.create({
    baseURL: 'https://aiti-crm-server.herokuapp.com'
  });
  return instance;
};

export default axios();
