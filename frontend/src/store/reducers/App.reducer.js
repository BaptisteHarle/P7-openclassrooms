const INITIAL_STATE = {
  posts: [],
  comments: [],
};

const appReducer = (state = INITIAL_STATE, action = null) => {
  let nextState = {};
  switch (action.type) {
    case 'UPDATE_APP':
      const { posts, comments } = action.value;

      if (posts) nextState.posts = posts;
      if (comments) nextState.comments = comments;

      return nextState;
    default:
      return state;
  }
};

export default appReducer;
