const initState = {
  documents: [],
  bills: [],
  lettings: null,
  billUpdated: false
};

const tenant = (state = initState, action) => {
  switch (action.type) {
    case 'TENANT_DOCUMENTS_LOAD_SUCCESS':
      return {
        ...state,
        documents: action.data
      };
    case 'TENANT_BILLS_LOAD_SUCCESS':
      return {
        ...state,
        bills: action.data
      };
    case 'TENANT_LETTINGS_LOAD_SUCCESS':
      return {
        ...state,
        lettings: action.data
      };
    case 'TENANT_BILLS_UPDATE_SUCCESS':
      return {
        ...state,
        billUpdated: true
      };
    default:
      return state
  }
};

export default tenant;
