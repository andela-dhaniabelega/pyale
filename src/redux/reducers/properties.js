const initState = {
  allProperties: [],
  singleProperty: {}
};

const properties = (state = initState, action) => {
  switch (action.type) {
    case 'LOAD_PROPERTY_SUCCESS':
      return {
        ...state,
        allProperties: action.data
      };
    case 'PROPERTY_FILTER_SUCCESS':
      return {
        ...state,
        allProperties: action.data
      };
    case 'LOAD_PROPERTY_DETAIL_SUCCESS':
      return {
        ...state,
        singleProperty: action.data
      };
    default:
      return state
  }
};

export default properties