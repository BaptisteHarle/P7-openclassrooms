import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import config from '../config';
import Button from './Button';

function Header({ dispatch, user }) {

  const router = useHistory();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function onLogin() {
    router.push('/');
  }

  function onSignup() {
    router.push('/signup');
  }

  function onLogout() {
    localStorage.removeItem('jwt');
    const action = {
      type: 'UPDATE_USER',
      value: null,
    };

    dispatch(action);
    router.push('/');
  }

  function confirmModalToggle() {
    setShowConfirm(!showConfirm);
  }

  function onManage() {
    router.push('/manage')
  }

  async function onDelete() {
    setDeleteLoading(true);

    const url = `${config.api.endpoint}${config.api.routes.user}/${user.user.id}`;
    const jwt = localStorage.getItem('jwt');

    // On supprime l'utilisateur en base
    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    // On supprime le JWT de la mémoire
    localStorage.removeItem('jwt');
    const action = {
      type: 'UPDATE_USER',
      value: null,
    };

    dispatch(action);
    router.push('/');

    setDeleteLoading(false);
    confirmModalToggle();
  }

  return (
    <>
      <nav class="navbar navbar-expand-sm navbar-light bg-light">
        <img class="navbar-brand" src="/logo.png" alt="Gourpomania" />
        {/* <a class="navbar-brand" href="#">Navbar w/ text</a> */}
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav mr-auto">
            {!user.user && (
              <li className="nav-item">
                <Button
                  label="Inscription"
                  bgColor="#FFD6D7"
                  color="black"
                  onPress={onSignup}
                  marginRight={20} />
              </li>
            )}
            {!user.user && (
              <li className="nav-item">
                <Button
                  label="Connexion"
                  bgColor="#d7fed6"
                  color="black"
                  onPress={onLogin}
                  marginRight={20} />
              </li>
            )}
            {user.user && (
              <li className="nav-item">
                <Button
                  label="Suppression du compte"
                  bgColor="red"
                  color="white"
                  onPress={confirmModalToggle} />
              </li>
            )}
            {user.user && (
              <li className="nav-item">
                <Button
                  label="Déconnexion"
                  bgColor="lightgrey"
                  color="black"
                  onPress={onLogout} />
              </li>
            )}
             {user.user.id === 1 && (
              <li className="nav-item">
                <Button
                  label="Gestion"
                  bgColor="red"
                  color="white"
                  onPress={onManage} />
              </li>
            )}
          </ul>
        </div>
      </nav>
      <Modal show={showConfirm} onHide={confirmModalToggle}>
        <Modal.Header closeButton>
          <Modal.Title>ATTENTION</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Vous êtes sur le point de supprimer votre compte Groupomania. Cette action est <b>irréversible</b>.
        </Modal.Body>
        <Modal.Footer>
          <Button
            label="Fermer"
            bgColor="lightgrey"
            color="black"
            onPress={confirmModalToggle}
          />
          <Button
            label="Supprimer mon compte"
            bgColor="red"
            color="white"
            loading={deleteLoading}
            onPress={onDelete}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default connect(state => state)(Header);
