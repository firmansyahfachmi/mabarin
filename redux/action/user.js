import Axios from 'axios';

export const getUser = uid => {
  return {
    type: 'GET_USER',
    payload: Axios.get(
      `http://18.141.12.25:6969/api/users/uid/${uid}`,
    ),
  };
};
export const postUser = data => {
  return {
    type: 'POST_USER',
    payload: Axios.post(
      `http://18.141.12.25:6969/api/users/register`, data
    )
  }
}
export const sendHistory = (uid, data) => {
  return {
    type: 'PATCH_HISTORY',
    payload: Axios.patch(
      `http://18.141.12.25:6969/api/users/uid/${uid}`, data
    ),
  };
};
