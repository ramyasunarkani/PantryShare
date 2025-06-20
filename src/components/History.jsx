import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FIREBASE_DB_URL } from '../Store/auth-actions';

const History = () => {
  const user = useSelector((state) => state.auth);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  const safeEmail = user.email?.replace(/\./g, '_');

  const fetchReservedHistory = async () => {
    if (!safeEmail || !user.token) return;

    try {
      const res = await axios.get(
        `${FIREBASE_DB_URL}/reservedHistory/${safeEmail}.json?auth=${user.token}`
      );
      setItems(res.data || {});
      setLoading(false);
    } catch (err) {
      console.error('Error fetching history:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservedHistory();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reserved Items History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : Object.keys(items).length === 0 ? (
        <p>No items reserved yet.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(items).map(([id, item]) => (
            <div
              key={id}
              className="border p-4 bg-white rounded shadow w-full max-w-xl mx-auto"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-36 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-500">
                Status: <strong>{item.status}</strong>
              </p>
              <p className="text-sm text-gray-500">From: {item.sharerName}</p>
              <p className="text-xs text-gray-400">
                Expires: {new Date(item.expiryDate).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
