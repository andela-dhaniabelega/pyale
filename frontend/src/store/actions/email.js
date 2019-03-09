import {setAuthHeader} from "../../actionHelpers";
import axios from "axios";
import constants from "../../appConstants";

export const sendSupportEmail = (payload) => {
  return (dispatch, getState) => {
    const headers = setAuthHeader(getState);
    return axios.post(`${constants.LOCAL_HOST}/api/v1/tenant/support/`, payload, {headers})
      .then((res) => {
        dispatch({type: 'SUPPORT_EMAIL_SEND_SUCCESS'})
      }).catch((error) => {
        console.log(error)
      })
  }
};

export const sendEnquiryEmail = (payload) => {
  return (dispatch, getState) => {
    const headers = setAuthHeader(getState);
    return axios.post(`${constants.LOCAL_HOST}/api/v1/enquiry/`, payload, {headers})
      .then((res) => {
        dispatch({type: 'ENQUIRY_EMAIL_SEND_SUCCESS'})
      }).catch((error) => {
        console.log(error)
      })
  }
};