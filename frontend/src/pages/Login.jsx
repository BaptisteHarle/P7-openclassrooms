import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import actions from '../utils/actions';
import config from '../config';
import { Button, Input } from '../components';

function Login({ dispatch }) {

  const router = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { fetchUserInfos, checkSession } = actions;

  useEffect(() => {
    async function onStart() {
      if (checkSession()) {
        const user = await fetchUserInfos();
        const action = {
          type: 'UPDATE_USER',
          value: user,
        };
        dispatch(action);
        router.push('/wall');
      }
    }
    onStart();
    return () => {};
  }, [router, checkSession, fetchUserInfos, dispatch]);

  async function onSubmit() {
    setLoading(true);
    const url = config.api.endpoint + config.api.routes.login;
    const body = { email, password };

    const res = await axios.post(url, body);
    const response = res.data;
    const { code, data, msg } = response;

    if(code === 200) {
      const { token, user } = data;
      localStorage.setItem('jwt', token);
      const action = {
        type: 'UPDATE_USER',
        value: user,
      };
      dispatch(action);
      router.push('/wall');
    } else {
      alert(msg);
    }
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="form">
        <h1>Connexion à Groupomania</h1>
        <p>La plateforme de partage pour toute l'équipe</p>
        <Input
          label="Email"
          type="email"
          onChange={(value) => setEmail(value)}
        />
        <Input
          label="Mot de passe"
          type="password"
          onChange={(value) => setPassword(value)}
        />
        <Button
          label="Connexion"
          bgColor="#d7fed6"
          width="100%"
          marginTop={40}
          color="black"
          loading={loading}
          onPress={onSubmit}
        />
      </div>
    </div>
  );
}

export default connect(state => state)(Login);
