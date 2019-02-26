import axios from 'axios';

const loginLink = 'http://127.0.0.1:8000/api/v1/rest-auth/login/';
const loadUserLink = 'http://127.0.0.1:8000/api/v1/rest-auth/user/';
const logOutLink = 'http://127.0.0.1:8000/api/v1/rest-auth/logout/';


export const loadUser = () => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    let headers = {};
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    return axios.get(loadUserLink, {headers: headers})
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

    return axios.post(loginLink, body)
      .then(res => {
        dispatch({type: 'LOGIN_SUCCESS', data: res.data});
        return res.data;
      }).catch((error)=>{
        dispatch({type: "LOGIN_FAILED", error});
      })
  }
};

export const logout = () => {
  return (dispatch, getState) => {
    return axios.post(logOutLink)
      .then(() => {
        dispatch({type: 'LOGOUT_SUCCESS'})
      })
  }
}
