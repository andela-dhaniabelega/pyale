const initState = {
  billUpdated: false
};

const tenantReset = (state = initState, action) => {
  switch (action.type) {
    case 'TENANT_BILLS_UPDATE_SUCCESS':
      return {
        ...state,
        billUpdated: true
      };
    default:
      return state
  }
};

export default tenantReset;
