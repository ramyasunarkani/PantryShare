import axios from 'axios';
import { FIREBASE_DB_URL } from './auth-actions'; 
import { itemActions } from './item-slice';

export const addItem = (formData) => {
  return async (dispatch, getState) => {
    const state = getState();
    const token = state.auth.token;
    const name = state.auth.name;
    const photo = state.auth.photo;
    const uid = state.auth.uid;

    if (!token || !uid) {
      console.error('User not logged in or missing UID');
      return;
    }

    const {
      title,
      description,
      tags,
      image,
      expiryDate,
      address,
    } = formData;

    try {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });

      const location = await new Promise((resolve) =>
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve(null)
        )
      );

      const itemData = {
        title,
        description,
        imageUrl: base64Image,
        sharerId: uid,
        sharerName: name,
        sharerPhoto: photo,
        location,
        address,
        tags: tags
          .split(',')
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag !== ''),
        status: 'available',
        reservedBy: null,
        expiryDate: new Date(expiryDate).toISOString(),
        postedAt: new Date().toISOString(),
      };

      const res = await axios.post(
        `${FIREBASE_DB_URL}/nitems.json?auth=${token}`,
        itemData
      );

      const itemId = res.data.name;

      await axios.put(
        `${FIREBASE_DB_URL}/userItems/${uid}/${itemId}.json?auth=${token}`,
        itemData
      );

      console.log('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
};


export const fetchItems = () => {
    return async (dispatch) => {
      try {
        const res = await axios.get(`${FIREBASE_DB_URL}/nitems.json`);
        const items = res.data || {};
        dispatch(itemActions.setItems(items));
      } catch (error) {
        console.error('Failed to fetch items', error);
      }
    };
  };
  