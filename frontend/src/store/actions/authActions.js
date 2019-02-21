import axios from 'axios';

const loginLink = 'http://127.0.0.1:8000/api/v1/user/login/';

export const login = (credentials) => {
  return (dispatch, getState) => {
    axios.post(loginLink, {'email':credentials.email, 'password': credentials.password}).then((response) => {
      console.log(response)
    }).catch((error) => {
      console.log(error)
      dispatch({ type: 'LOGIN_ERROR', error })
    })
    // console.log("Entered Login Action", email, password);
    // dispatch({type: 'LOGIN_SUCCESS'})
    // APICALL().then(() => {
    //   dispatch({type: 'LOGIN_SUCCESS', user})
    // }).catch((error) => {
    //   dispatch({ type: 'LOGIN_ERROR', error })
    // })
  }
};
