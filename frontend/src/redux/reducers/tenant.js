const initState = {
  documents: [],
  bills: []
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
    default:
      return state
  }
};

export default tenant;
