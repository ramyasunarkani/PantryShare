import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FIREBASE_DB_URL } from '../Store/auth-actions';
import Modal from './UI/Modal';
import { IoClose } from 'react-icons/io5';

const ItemModal = ({ item, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  const handleReserve = async () => {
    if (!user.token || !user.uid) {
      alert('Please log in to reserve.');
      return;
    }

    const updatedItem = {
      ...item,
      status: 'reserved',
      reservedBy: user.uid,
    };

    try {
      await axios.put(
        `${FIREBASE_DB_URL}/nitems/${item.id}.json?auth=${user.token}`,
        updatedItem
      );

      await axios.put(
        `${FIREBASE_DB_URL}/userItems/${item.sharerId}/${item.id}.json?auth=${user.token}`,
        updatedItem
      );

      const safeEmail = user.email.replace(/\./g, '_'); 
      await axios.put(
        `${FIREBASE_DB_URL}/reservedHistory/${safeEmail}/${item.id}.json?auth=${user.token}`,
        updatedItem
      );

      alert('Item reserved successfully!');
      onClose();
    } catch (err) {
      console.error('Error reserving item:', err);
      alert('Reservation failed.');
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">
          <IoClose />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-28 object-cover rounded"
          />
        )}
        <div className="flex items-center gap-2">
          <img src={item.sharerPhoto} alt="Sharer" className="w-10 h-10 rounded-full" />
          <h3 className="font-semibold">{item.sharerName}</h3>
        </div>
        <h2 className="text-xl font-bold">{item.title}</h2>
        <p>{item.description}</p>
        <p className="text-sm text-gray-600">Tags: {item.tags?.join(', ')}</p>
        <p className="text-sm text-gray-500">📍 {item.address || 'Not provided'}</p>
        <p className="text-sm text-gray-500">
          Expires on: {new Date(item.expiryDate).toLocaleString()}
        </p>

        {item.status === 'available' ? (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleReserve}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Reserve
            </button>
          </div>
        ) : (
          <p className="text-red-600 font-semibold">Item already reserved</p>
        )}
      </div>
    </Modal>
  );
};

export default ItemModal;
