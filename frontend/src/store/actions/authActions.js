import axios from 'axios';
import constants from '../../appConstants'
import {setAuthHeader} from '../../actionHelpers'


export const loadUser = () => {
  return (dispatch, getState) => {
    const headers = setAuthHeader(getState);
    return axios.get(`${constants.LOCAL_HOST}/api/v1/rest-auth/user/`, {headers})
      .then(res => {
        dispatch({type: 'USER_LOADED', data: res.data});
      }).catch((error) => {
        dispatch({type: "AUTHENTICATION_ERROR", error});
      });
  }
};

export const login = (credentials) => {
  return (dispatch, getState) => {
    let body = {'email': credentials.email, 'password': credentials.password};

    return axios.post(`${constants.LOCAL_HOST}/api/v1/rest-auth/login/`, body)
      .then(res => {
        dispatch({type: 'LOGIN_SUCCESS', data: res.data});
        return res.data;
      }).catch((error) => {
        dispatch({type: "LOGIN_FAILED", error});
      })
  }
};

export const logout = () => {
  return (dispatch, getState) => {
    return axios.post(`${constants.LOCAL_HOST}/api/v1/rest-auth/logout/`)
      .then(() => {
        dispatch({type: 'LOGOUT_SUCCESS'})
      })
  }
};
