const initState = {
  documents: []
};

const tenant = (state = initState, action) => {
  switch (action.type) {
    case 'TENANT_DOCUMENTS_SUCCESS':
      return {
        ...state,
        documents: action.data
      };
    default:
      return state
  }
};

export default tenant;
