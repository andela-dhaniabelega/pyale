const initState = {
  passwordResetComplete: false,
  passwordResetIncomplete: null,
  passwordChangeComplete: false,
  passwordChangeIncomplete: false,
  emailChangeComplete: false,
  emailChangeInComplete: false,
  passwordResetLinkSent: false,
  passwordResetLinkNotSent: false,
  passwordResetError: ''
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
    case 'PASSWORD_CHANGE_SUCCESS':
      return {
        ...state,
        passwordChangeComplete: true,
        passwordChangeIncomplete: false
      };
    case 'PASSWORD_CHANGE_ERROR':
      return {
        ...state,
        passwordChangeIncomplete: true
      };
    case 'EMAIL_CHANGE_SUCCESS':
      return {
        ...state,
        emailChangeComplete: true,
        emailChangeInComplete: false,
      };
    case 'EMAIL_CHANGE_ERROR':
      return {
        ...state,
        emailChangeInComplete: true
      };
    case 'PASSWORD_RESET_TOKEN_SUCCESS':
      return {
        ...state,
        passwordResetLinkSent: true
      };
    case 'PASSWORD_RESET_TOKEN_ERROR':
      return {
        ...state,
        passwordResetLinkSent: false,
        passwordResetError: "Unable to Reset Password. Please ensure you're using your registered email address." +
          "  Contact support (support@pyaleproperties.com) if this persists."
      };
    default:
      return state
  }
};

export default authReset;
