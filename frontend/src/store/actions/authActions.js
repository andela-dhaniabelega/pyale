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

export const createPasswordResetToken = (email) => {
  return (dispatch, getState) => {
    return axios.post(`${constants.LOCAL_HOST}/api/v1/password_reset/`, {'email': email})
      .then((res) => {
        dispatch({type: 'PASSWORD_RESET_TOKEN_SUCCESS'})
      }).catch((error) => {
        dispatch({type: 'PASSWORD_RESET_TOKEN_ERROR'})
      })
  }
};

export const resetPassword = (credentials) => {
  return (dispatch, getState) => {
    return axios.post(`${constants.LOCAL_HOST}/api/v1/password_reset/confirm/`,
      {'password': credentials.password, 'token': credentials.token})
      .then((res) => {
        dispatch({type: "PASSWORD_RESET_SUCCESS"})
      }).catch((error) => {
        dispatch({type: "PASSWORD_RESET_ERROR"})
      })
  }
};

export const changePassword = (credentials) => {
  return (dispatch, getState) => {
    const headers = setAuthHeader(getState);
    const body = {
      'new_password1': credentials.newPassword,
      'new_password2': credentials.newPasswordRepeat,
      'old_password': credentials.currentPassword
    };
    return axios.post(`${constants.LOCAL_HOST}/api/v1/rest-auth/password/change/`, body, {headers})
      .then((res) => {
        dispatch({type: "PASSWORD_CHANGE_SUCCESS"})
      }).catch((error) => {
        dispatch({type: "PASSWORD_CHANGE_ERROR"})
      })
  }
};

export const changeEmail = (email, id) => {
  return (dispatch, getState) => {
    const headers = setAuthHeader(getState);
    const body = {'email': email};
    return axios.patch(`${constants.LOCAL_HOST}/api/v1/tenant/${id}/email/change/`, body, {headers})
      .then((res) => {
        dispatch({type: "EMAIL_CHANGE_SUCCESS"})
      }).catch((error) => {
        dispatch({type: "EMAIL_CHANGE_ERROR"})
      })
  }
};

