import React, { useState } from 'react';
import { connect } from 'react-redux';
import Comment from './Comment';
import Button from './Button';
import moment from 'moment';
import 'moment/locale/fr';
import v from '../utils/validation';
import actions from '../utils/actions';
import config from '../config';
import axios from 'axios';

const { getPosts } = actions;

function Post({ post, user: sessionUser, onDelete }) {

  moment.locale = 'fr';

  const { content, createdAt, comments, img, user: author } = post;

  const [commentsVisible, setCommentsVisible] = useState(false);
  const [nextComment, setNextComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [postDeleteLoading, setPostDeleteLoading] = useState(false);

  const hasAuthor = author ? true : false;
  const isAdmin = sessionUser.user.roleId === 1;
  const isAuthor = hasAuthor && author.id === sessionUser.user.id;

  const canDelete = isAuthor || isAdmin;

  function onCommentsToggle(e) {
    e.preventDefault();
    setCommentsVisible(!commentsVisible);
  }


  async function onDeletePost(e) {
    e.preventDefault();
    setPostDeleteLoading(true);
    const jwt = localStorage.getItem('jwt');
    const url = `${config.api.endpoint}${config.api.routes.post}/${post.id}`;
    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    await getPosts();

    setPostDeleteLoading(false);
  }

  async function onNewComment() {
    setCommentLoading(true);
    if (v.post.comment(nextComment)) {
      const url = config.api.endpoint + config.api.routes.comment;
      const body = {
        postId: post.id,
        content: nextComment,
      };
      const jwt = localStorage.getItem('jwt');

      const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      await getPosts();

    }
    setCommentLoading(false);
    setNextComment('');
  }

  return (
    <article className="post">
      <p className="author">
        {isAuthor ? 'Vous' : `${hasAuthor ? `${author.firstName} ${author.lastName.toUpperCase()}` : `Utilisateur supprimé`}`}
      </p>
      <p className="date">{moment(createdAt).lang('fr').format('LLLL')}</p>
      {img && (
         <img className="image" src={img} alt={content}/>
      )}
      <p style={{ textAlign: 'left', color: '#faa1a1', width: '100%', fontSize: 30, marginBottom: 20 }}>❞</p>
      <p className="content">{content}</p>
      <p style={{ textAlign: 'right', color: '#faa1a1', width: '100%', fontSize: 30, marginBottom: 20 }}>❞</p>
      <div className="btns">
        <a href="/wall" onClick={onCommentsToggle}>{commentsVisible ? `Fermer les commentaires` : 'Voir les commentaires'} <span className="commentsNb">{comments.length}</span></a>
        {canDelete && (
          <>
            {postDeleteLoading ? (
              <label className="deletePost">Chargement...</label>
            ) : (
              <a className="deletePost" href="/wall" onClick={onDeletePost}>Supprimer le post</a>
            )}
          </>
        )}
      </div>
      {commentsVisible && (
        <>
          <div className="addComments">
            <input type="text" onChange={(e) => setNextComment(e.target.value)} />
            <Button
              label="Envoyer"
              bgColor="#40aef8"
              width="100%"
              color="white"
              loading={commentLoading}
              onPress={onNewComment}
            />
          </div>
          <div className="comments">
            {comments && comments.length > 0 && comments.map(
              (c) => (<Comment key={String(c.id)} comment={c} />)
            )}
          </div>
        </>
      )}
    </article>
  );
}

export default connect(state => state)(Post);
