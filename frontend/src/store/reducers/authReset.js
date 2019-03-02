const initState = {
  passwordResetComplete: false,
  passwordResetIncomplete: null
};

const authReset = (state = initState, action) => {
  switch (action.type) {
    case 'PASSWORD_RESET_SUCCESS':
      return {
        ...state,
        passwordResetComplete: true
      };
    case 'PASSWORD_RESET_ERROR':
      return {
        ...state,
        passwordResetIncomplete: true
      };
    default:
      return state
  }
};

export default authReset;
