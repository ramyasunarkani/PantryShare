import axios from 'axios';
import { authActions } from './auth';

export const FIREBASE_API_KEY = 'AIzaSyCYdTv0Ni6CrGOPE1ieqf7nJ42vV_C0S4Y'; 
export const FIREBASE_DB_URL = 'https://pantryshare-20957-default-rtdb.firebaseio.com'; 

export const createUser = (email, password) =>
  axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
    {
      email,
      password,
      returnSecureToken: true,
    }
  );

export const saveUserToDB = (uid, data, idToken) =>
  axios.put(`${FIREBASE_DB_URL}/users/${uid}.json?auth=${idToken}`, data);


export const loginUser = (email, password) => {
  return axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      email,
      password,
      returnSecureToken: true,
    }
  );
};

export const getUserFromDB = (uid, idToken) => {
  return axios.get(
    `${FIREBASE_DB_URL}/users/${uid}.json?auth=${idToken}`
  );
};

export const signup = (email, password, fullName, photo) => {
  return async (dispatch) => {
    try {
      const res = await createUser(email, password);
      const { localId: uid, idToken } = res.data;

      const userData = {
        fullName,
        email,
        photoURL: photo,
      };

      await saveUserToDB(uid, userData, idToken);

      dispatch(authActions.login({
        token: idToken,
        name: fullName,
        email,
        photo,
        uid
      }));
    } catch (error) {
      console.error("Signup error:", error.response?.data?.error || error.message);
    }
  };
};



export const login = (email, password) => {
  return async (dispatch) => {
    const res = await loginUser(email, password);
    const { localId: uid, idToken } = res.data;

    const userRes = await getUserFromDB(uid, idToken);
    console.log(userRes);

    const { fullName, email: savedEmail, photoURL } = userRes.data;

    dispatch(authActions.login({
      token: idToken,
      name: fullName,
      email: savedEmail,
      photo: photoURL,
      uid
    }));
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch(authActions.logout());
  };
};
