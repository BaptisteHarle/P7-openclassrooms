import axios from 'axios';
import jwtDecode from 'jwt-decode';
import config from '../config';
import Store from '../store';

const actions = {
  async fetchUserInfos() {
    const jwt = localStorage.getItem('jwt');
    const user = jwtDecode(jwt);
    return user;
  },
  async getPosts() {
    const url = config.api.endpoint + config.api.routes.post;
    const jwt = localStorage.getItem('jwt');
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const posts = response.data.data.posts;

    const action = {
      type: 'UPDATE_APP',
      value: { posts },
    };

    Store.dispatch(action);
    return posts;
  },
  checkSession() {
    const jwt = localStorage.getItem('jwt');
    return jwt ? true : false;
  }
};

export default actions;
