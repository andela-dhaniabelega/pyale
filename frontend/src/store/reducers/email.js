const initState = {
  supportEmailSent: false,
  enquiryEmailSent: false
};

const tenant = (state = initState, action) => {
  switch (action.type) {
    case 'SUPPORT_EMAIL_SEND_SUCCESS':
      return {
        ...state,
        supportEmailSent: true
      };
    case 'ENQUIRY_EMAIL_SEND_SUCCESS':
      return {
        ...state,
        enquiryEmailSent: true
      };
    default:
      return state
  }
};

export default tenant;
