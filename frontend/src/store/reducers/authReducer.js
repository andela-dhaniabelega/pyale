const initState = {
  authError: null
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      console.log("Entered Auth Reducer");
      return {
        ...state,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        authError: "Incorrect Username or Password"
      };
    default:
      return state
  }
};

export default authReducer;
