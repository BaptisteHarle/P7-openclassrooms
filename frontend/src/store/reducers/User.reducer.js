const INITIAL_STATE = {
  user: null,
};

const appReducer = (state = INITIAL_STATE, action = null) => {
  let nextState = {};
  switch (action.type) {
    case 'UPDATE_USER':
      nextState.user = action.value;
      return nextState;
    default:
      return state;
  }
};

export default appReducer;
