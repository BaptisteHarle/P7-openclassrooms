import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import actions from '../utils/actions';
import v from '../utils/validation';
import config from '../config';
import { Button, Post } from '../components';

function Wall({ dispatch, user, app }) {
  const { posts, } = app;

  const router = useHistory();

  const { fetchUserInfos, checkSession, getPosts } = actions;

  const [content, setContent] = useState('');
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

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
        await getPosts();
      }
    }
    onStart();
  }, [router, checkSession, fetchUserInfos, dispatch, getPosts]);

  async function onPost(e) {
    setPostLoading(true);
    if (checkForm()) {
      const url = config.api.endpoint + config.api.routes.post;
      const data = new FormData();
      const img = file;
      // const input = document.getElementById('input');
      console.log(img);
      if (img) {
        data.append('img', img, {
          uri: img.uri,
          type: img.type,
          name: 'img'
        });
      }
      data.append('content', content);
      const jwt = localStorage.getItem('jwt');
      await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        }
      });
      await getPosts();
    }
    setPostLoading(false);
    setContent('');
  }

  function checkForm() {
    let isValid = true;
    setError(null);
    if (!v.post.content(content)) {
      isValid = false;
      setError(true);
    }
    return isValid;
  }

  return (
    <div className="page">
      {user.user && (
        <div className="wall">
          <p className="hi">Bonjour <span>{user.user.email}</span>, quoi de neuf aujourd'hui ?</p>
          <textarea maxLength={255} className={error && 'error'} onChange={(e) => setContent(e.target.value)} />
          <input id="input" type="file" onChange={(e) => setFile(e.target.files[0])} onClick={e => (e.target.value = null)}/>
          <Button
            label="Poster"
            bgColor="#faa1a1"
            width="100%"
            marginTop={10}
            color="black"
            loading={postLoading}
            onPress={onPost}
          />
          <div className="separator"></div>

          {posts && posts.length > 0 && posts.map(
            (p) => (
              <Post
                key={String(p.id)}
                post={p}
                sessionUser={user.user.id} />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default connect(state => state)(Wall);
