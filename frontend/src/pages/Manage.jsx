import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import actions from '../utils/actions';
import config from '../config';
import { Button } from '../components';

function Manage({ dispatch, app }) {
  const { users, } = app;

  const router = useHistory();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { fetchUserInfos, checkSession, getUsers } = actions;

  useEffect(() => {
    async function onStart() {
      if (!checkSession()) {
        router.push('/');
      } else {
        const user = await fetchUserInfos();
        const action = {
          type: 'UPDATE_USER',
          value: user,
        };
        dispatch(action);
        await getUsers();
      }
    }
    onStart();
  }, [router, checkSession, fetchUserInfos, dispatch, getUsers]);

  function confirmModalToggle() {
    setShowConfirm(!showConfirm);
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

    setDeleteLoading(false);
    confirmModalToggle();
  }

  return (
    <div className="page">
      <div className="form">
        <h1>Gestion des utilisateurs</h1>
        <table>
          <tr>
            <td><center>Nom</center></td>
            <td><center>Prénom</center></td>
            <td><center>adresse mail</center></td>
            <td><center>Supprimer</center></td>
          </tr>
          <tr>
          {users.map(
          (u) => (
            <>
            <td><center>{u.firstName}</center></td>
            <td><center>{u.lastName}</center></td>
            <td><center>{u.email}</center></td>
            <td><center><Button
              label="Supprimer le compte"
              bgColor="red"
              color="white"
              onPress={confirmModalToggle}
            /></center></td>
            </>
          )
        )}
          </tr>
        </table>
        <Modal show={showConfirm} onHide={confirmModalToggle}>
          <Modal.Header closeButton>
            <Modal.Title>ATTENTION</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Vous êtes sur le point de supprimer le compte Groupomania d'un utilisateur. Cette action est <b>irréversible</b>.
          </Modal.Body>
          <Modal.Footer>
            <Button
              label="Fermer"
              bgColor="lightgrey"
              color="black"
              onPress={confirmModalToggle}
            />
            <Button
              label="Supprimer le compte"
              bgColor="red"
              color="white"
              loading={deleteLoading}
              onPress={onDelete}
            />
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default connect(state => state)(Manage);
