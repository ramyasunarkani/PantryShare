import api from './api';
import { authActions } from './auth';
import { toast } from 'react-toastify';

export const signup = (fullName, email, password) => {
  return async (dispatch) => {
    try {
      const res = await api.post('/auth/signup', { fullName, email, password });
      const { user, token } = res.data;

      dispatch(authActions.login({
        token,
        name: user.fullName,
        email: user.email,
        photo: user.photoURL,
        userId: user.id,  
        location: user.location || { lat: null, lng: null },
      }));
       toast.success('Signup successful!');
      
    } catch (error) {
        toast.error('Signup failed: ' + error.message);

      console.error('Signup error:', error.response?.data?.message || error.message);
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      dispatch(authActions.login({
        token,
        name: user.fullName,
        email: user.email,
        photo: user.photoURL,
        userId: user.id,
        location: user.location || { lat: null, lng: null },
      }));
             toast.success('Login successful!');

    } catch (error) {
              toast.error('Login failed: ' + error.message);

      console.error('Login error:', error.response?.data?.message || error.message);
    }
  };
};

export const editProfile = (updatedData) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      let res;
      if (updatedData.photo && typeof updatedData.photo !== "string") {
        const formData = new FormData();
        formData.append("fullName", updatedData.fullName);
        formData.append("photo", updatedData.photo);
        formData.append("location", JSON.stringify(updatedData.location));

        res = await api.put("/auth/edit-profile", formData, {
          headers: { Authorization: token },
        });
      } else {
        res = await api.put(
          "/auth/edit-profile",
          {
            fullName: updatedData.fullName,
            location: updatedData.location,
          },
          {
            headers: { Authorization: token },
          }
        );
      }

      dispatch({
        type: "auth/updateProfile",
        payload: res.data.user,
      });
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };
};


export const fetchProfile = () => {
    const token= localStorage.getItem('token');

  return async (dispatch) => {
    try {
      const res = await api.get('/auth/profile', {
        headers: { Authorization: token },
      });

      const user = res.data.user;

      dispatch(authActions.login({
        token,
        name: user.fullName,
        email: user.email,
        photo: user.photoURL,
        userId: user.id,
        location: user.location || { lat: null, lng: null },
      }));
    } catch (error) {
      console.error('Fetch profile error:', error.response?.data?.message || error.message);
    }
  };
};

export const logout = () => (dispatch) => {
  dispatch(authActions.logout());
};
