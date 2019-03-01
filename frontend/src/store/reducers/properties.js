const initState = {
  allProperties: []
};

const properties = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_PROPERTY_SUCCESS':
      return {
        ...state,
        allProperties: action.data
      };
    default:
      return state
  }
};

export default properties