import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/fr';
import actions from '../utils/actions';
import config from '../config';

const { getPosts } = actions;

function Comment({ comment, user: sessionUser }) {
  const { user, createdAt, content } = comment;

  const hasAuthor = user ? true : false;
  const isAdmin = sessionUser.user.roleId === 1;
  const isAuthor = hasAuthor && sessionUser.user.id === user.id;
  const canDelete = isAuthor || isAdmin;

  const [deleteLoading, setDeleteLoading] = useState(false);

  async function onDeleteComment(e) {
    e.preventDefault();
    setDeleteLoading(true);

    const url = `${config.api.endpoint}${config.api.routes.comment}/${comment.id}`;
    const jwt = localStorage.getItem('jwt');

    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    await getPosts();

    setDeleteLoading(false);
  }

  return (
    <div className="comment">
      <p className="commentAuthor">
        {isAuthor ? 'Vous' : `${hasAuthor ? `${user.firstName} ${user.lastName.toUpperCase()}` : `Utilisateur supprimé`}`}
      </p>
      <p className="commentDate">{moment(createdAt).lang('fr').format('LLLL')}</p>
      <p className="commentContent">{content}</p>
      {canDelete && (
        <>
          {deleteLoading ? (
            <label className="deletePost">Chargement...</label>
          ) : (
            <a className="deletePost" href="/wall" onClick={onDeleteComment}>Supprimer le commentaire</a>
          )}
        </>
      )}
    </div>
  );
}

export default connect(state => state)(Comment);
