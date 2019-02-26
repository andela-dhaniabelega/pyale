import axios from 'axios';

const HOST = 'http://127.0.0.1:8000';

export const getTenantDocuments = () => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    let headers = {};
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    return axios.get(`${HOST}/api/v1/tenant/documents/`, {headers})
      .then((res) => {
        dispatch( {type: 'TENANT_DOCUMENTS_SUCCESS', data: res.data} )
      }).catch((error) => {
        console.log(error)
      })
  }
};

