import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import actions from '../utils/actions';
import { Button } from '../components';

function Manage({ dispatch, app }) {
  const { users } = app;

  const router = useHistory();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(null);

  const { fetchUserInfos, checkSession, getUsers, deleteUser } = actions;

  useEffect(() => {
    async function onStart() {
      if (!checkSession()) {
        router.push('/');
      } else {
        const user = await fetchUserInfos();
        if (user.roleId !== 1) return router.push('/');
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
    const { id } = selectedUser;

    confirmModalToggle();
    setLoading(id);

    await deleteUser(id);

    setLoading(null);

  }

  function onDeleteAsk(u) {
    confirmModalToggle();
    setSelectedUser(u);
  }

  return (
    <div className="page">
      <div className="form">
        <h1>Gestion des utilisateurs</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Identité</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users && users.map((u) => (
              <tr key={String(u.id)}>
                <td>{`${u.firstName} ${u.lastName.toUpperCase()}`}</td>
                <td>
                  <Button
                    style={{ margin: 'auto' }}
                    label={loading && loading === u.id ? 'En cours...' : 'Supprimer'}
                    disabled={loading}
                    bgColor="red"
                    color="white"
                    onPress={() => onDeleteAsk(u)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
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
              onPress={onDelete}
            />
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default connect(state => state)(Manage);