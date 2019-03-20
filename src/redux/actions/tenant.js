import axios from 'axios';
import constants from '../../appConstants'
import {setAuthHeader} from '../../actionHelpers'


export const getTenantDocuments = () => {
  return (dispatch, getState) => {
    const headers = setAuthHeader(getState);
    return axios.get(`${constants.LOCAL_HOST}/api/v1/tenant/documents/`, {headers})
      .then((res) => {
        dispatch({type: 'TENANT_DOCUMENTS_LOAD_SUCCESS', data: res.data})
      }).catch((error) => {
        console.log(error)
      })
  }
};

export const getTenantBills = () => {
  return (dispatch, getState) => {
    const headers = setAuthHeader(getState);
    const id = getState().auth.user.id;
    return axios.get(`${constants.LOCAL_HOST}/api/v1/tenant/${id}/bills/`, {headers})
      .then((res) => {
        dispatch({type: 'TENANT_BILLS_LOAD_SUCCESS', data: res.data})
      }).catch((error) => {
        console.log(error)
      })
  }
};

export const getTenantLettings = () => {
  return (dispatch, getState) => {
    const headers = setAuthHeader(getState);
    const id = getState().auth.user.id;
    return axios.get(`${constants.LOCAL_HOST}/api/v1/tenant/${id}/lettings/`, {headers})
      .then((res) => {
        dispatch({type: 'TENANT_LETTINGS_LOAD_SUCCESS', data: res.data})
      }).catch((error) => {
        console.log(error)
      })
  }
};

export const updateBillPaymentStatus = (id, date) => {
  return (dispatch, getState) => {
    const headers = setAuthHeader(getState);
    return axios.patch(
      `${constants.LOCAL_HOST}/api/v1/tenant/${id}/bills/update/`,
      {'payment_status': true, 'date_paid': date},
      {headers}
      ).then((res) => {
        dispatch({type: 'TENANT_BILLS_UPDATE_SUCCESS'})
      }).catch((error) => {
        console.log(error)
      })
  }
};



