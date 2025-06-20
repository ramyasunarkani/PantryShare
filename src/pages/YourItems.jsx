import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FIREBASE_DB_URL } from '../Store/auth-actions';

const YourItems = () => {
  const user = useSelector((state) => state.auth);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUserItems = async () => {
    try {
      const res = await axios.get(
        `${FIREBASE_DB_URL}/userItems/${user.uid}.json?auth=${user.token}`
      );
      setItems(res.data || {});
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch user items:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.token && user.uid) {
      fetchUserItems();
    }
  }, [user]);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`${FIREBASE_DB_URL}/nitems/${itemId}.json?auth=${user.token}`);
      await axios.delete(`${FIREBASE_DB_URL}/userItems/${user.uid}/${itemId}.json?auth=${user.token}`);
      fetchUserItems();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    const updatedItem = {
      ...items[itemId],
      status: newStatus,
    };

    try {
      await axios.put(`${FIREBASE_DB_URL}/nitems/${itemId}.json?auth=${user.token}`, updatedItem);
      await axios.put(`${FIREBASE_DB_URL}/userItems/${user.uid}/${itemId}.json?auth=${user.token}`, updatedItem);
      fetchUserItems();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const statusOptions = ['available', 'reserved', 'pickup', 'delivered'];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Shared Items</h2>

      {loading ? (
        <p>Loading...</p>
      ) : Object.keys(items).length === 0 ? (
        <p>No items shared yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(items).map(([id, item]) => (
            <div key={id} className="border p-4 bg-white rounded shadow w-full max-w-xl mx-auto">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-40 object-cover mb-3 rounded"
              />
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>

              <label className="block text-sm text-gray-500 mt-2">Status:</label>
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(id, e.target.value)}
                className="border px-2 py-1 rounded text-sm mt-1"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleDelete(id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourItems;
