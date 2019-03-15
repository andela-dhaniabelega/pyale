const initState = {
  authError: false,
  errors: false,
  isAuthenticated: null,
  token: localStorage.getItem("token"),
  user: {},
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem("token", action.data.key);
      return {
        ...state,
        user: action.data.user,
        isAuthenticated: true,
        authError: false,
        token: action.data.key
      };
    case 'USER_LOADED':
      return {
        ...state,
        user: action.data
      };
    case 'LOGIN_FAILED':
      return {
        ...state,
        authError: true,
        token: null,
        user: null,
        isAuthenticated: false
      };
    case 'LOGOUT_SUCCESS':
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false
      };
    default:
      return state
  }
};

export default authReducer;
