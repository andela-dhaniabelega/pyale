import axios from 'axios';
import constants from '../../appConstants'
import {setAuthHeader} from '../../actionHelpers'


export const getTenantDocuments = () => {
  return (dispatch, getState) => {
    const headers = setAuthHeader(getState);
    return axios.get(`${constants.LOCAL_HOST}/api/v1/tenant/documents/`, {headers})
      .then((res) => {
        dispatch({type: 'TENANT_DOCUMENTS_SUCCESS', data: res.data})
      }).catch((error) => {
        console.log(error)
      })
  }
};

