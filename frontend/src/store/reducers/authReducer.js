const initState = {
  authError: null,
  errors: false,
  isAuthenticated: null,
  token: localStorage.getItem("token"),
  user: {}
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem("token", action.data.token);
      return {
        ...state,
        user: action.data.user,
        isAuthenticated: true,
        errors: null
      };
    case 'LOGIN_FAILED':
      return {
        ...state,
        errors: true,
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
