import axios from 'axios'
import constants from '../../appConstants'


export const loadProperties = () => {
  return (dispatch, getState) => {
    return axios.get(`${constants.LOCAL_HOST}/api/v1/properties/`)
      .then((res) => {
        dispatch({type: 'LOAD_PROPERTY_SUCCESS', data: res.data})
      }).catch((error) => {
        console.log(error)
      })
  }
}