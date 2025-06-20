'use client';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { authActions } from '../Store/auth'; // Adjust path if needed

const FIREBASE_DB_URL = 'https://pantryshare-20957-default-rtdb.firebaseio.com';

const Profile = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(user.photo || '');
  const [location, setLocation] = useState(user.location || { lat: '', lng: '' });
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUpdatePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const newLoc = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setLocation(newLoc);

      try {
        await axios.patch(
          `${FIREBASE_DB_URL}/users/${user.uid}.json?auth=${user.token}`,
          { location: newLoc }
        );

        dispatch(authActions.login({
          token: user.token,
          name: user.name,
          email: user.email,
          photo: photoURL,
          location: newLoc,
          uid: user.uid,
        }));

        alert('Location updated!');
      } catch (err) {
        console.error(err);
        alert('Failed to update location');
      }
    });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    let updatedPhoto = photoURL;

    try {
      if (photoFile) {
        updatedPhoto = await convertToBase64(photoFile);
      }

      const updatedData = {
        fullName: user.name,
        email: user.email,
        photoURL: updatedPhoto,
        location,
      };

      await axios.put(
        `${FIREBASE_DB_URL}/users/${user.uid}.json?auth=${user.token}`,
        updatedData
      );

      dispatch(authActions.login({
        token: user.token,
        name: user.name,
        email: user.email,
        photo: updatedPhoto,
        location,
        uid: user.uid,
      }));

      alert('Profile updated!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-center">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <img
        src={photoURL}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover mx-auto"
      />

      <p className="text-lg font-medium">{user.name}</p>

      <button
        type="button"
        onClick={handleUpdatePhotoClick}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Update Photo
      </button>

      <div className="text-sm text-gray-600">
        <p>Latitude: {location?.lat || 'N/A'}</p>
        <p>Longitude: {location?.lng || 'N/A'}</p>
      </div>

      <button
        onClick={handleUpdateLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Update Location
      </button>

      <button
        onClick={handleUpdateProfile}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  );
};

export default Profile;
