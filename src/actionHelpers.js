export const setAuthHeader = (state) => {
  const token = state().auth.token;
    let headers = {};
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    return headers
};