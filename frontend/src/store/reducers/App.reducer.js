const INITIAL_STATE = {
  posts: [],
  comments: [],
  users: [],
};

const appReducer = (state = INITIAL_STATE, action = null) => {
  let nextState = {};
  switch (action.type) {
    case 'UPDATE_APP':
      const { posts, comments, users } = action.value;

      if (posts) nextState.posts = posts;
      if (comments) nextState.comments = comments;
      if (users) nextState.users = users;

      return nextState;
    default:
      return state;
  }
};

export default appReducer;