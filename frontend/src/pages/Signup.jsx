import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import actions from '../utils/actions';
import { Button, Input } from '../components';
import v from '../utils/validation';
import config from '../config';

function Signup({ dispatch }) {

  const router = useHistory();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [loading, setLoading] = useState(false);

  const { fetchUserInfos, checkSession } = actions;

  useEffect(() => {
    async function onStart() {
      if(checkSession()) {
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
  }, [router, checkSession, fetchUserInfos, dispatch]);


  async function onSubmit() {
    /**
     * 1) Verification des donnees et de leur exactitude
     *  2) Si tout OK, on envoie la requete
     *  3) sur la reponse on recupere le token et on le stocke
     *  4) on navigue vers wall
     */
    setLoading(true);
    if (checkForm()) {
      // je fais ma req, etc
      const body = {
        firstName,
        lastName,
        email,
        password,
      };

      const url = config.api.endpoint + config.api.routes.signup;

      const response = await axios.post(url, body);
      if(response && response.data && response.data.code && response.data.code === 200 && response.data.data.token) {
        localStorage.setItem('jwt', response.data.data.token);
        window.location.href = '/wall';
      } else {
        alert("Une erreur est survenue lors de l'inscription.");
      }
    }
    setLoading(false);
  }

  function checkForm() {
    let isValid = true;
    resetErrors();

    if (!v.user.firstName(firstName)) {
      setFirstNameError('Veuillez renseigner un prénom valide.');
      isValid = false;
    }
    if (!v.user.lastName(lastName)) {
      setLastNameError('Veuillez renseigner un nom valide.');
      isValid = false;
    }
    if (!v.user.email(email)) {
      setEmailError('Veuillez renseigner un email valide.');
      isValid = false;
    }
    if (!v.user.password(password)) {
      setPasswordError("Doit contenir 8 caractères dont un chiffre, une majuscule et un caractère spécial.");
      isValid = false;
    }

    return isValid;
  }

  function resetErrors() {
    setFirstNameError(null);
    setLastNameError(null);
    setEmailError(null);
    setPasswordError(null);
  }

  return (
    <div className="page">
      <div className="form">
        <h1>Inscription à Groupomania</h1>
        <p>La plateforme de partage pour toute l'équipe</p>
        <Input
          label="Nom"
          onChange={(value) => setLastName(value)}
          error={lastNameError}
        />
        <Input
          label="Prénom"
          onChange={(value) => setFirstName(value)}
          error={firstNameError}
        />
        <Input
          label="Email"
          type="email"
          onChange={(value) => setEmail(value)}
          error={emailError}
        />
        <Input
          label="Mot de passe"
          type="password"
          onChange={(value) => setPassword(value)}
          error={passwordError}
        />
        <Button
          label="Inscription"
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

export default connect(state => state)(Signup);
