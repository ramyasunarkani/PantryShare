import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems } from '../Store/item-actions';
import ItemModal from '../components/ItemModal';

const BrowseItems = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items?.allItems || {});
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchPlace, setSearchPlace] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const filteredItems = Object.entries(items).filter(([id, item]) => {
    const matchAddress = item.address?.toLowerCase().includes(searchPlace.toLowerCase());
    const matchStatus = onlyAvailable ? item.status === 'available' : true;
    return matchAddress && matchStatus;
  });

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by address or place..."
          value={searchPlace}
          onChange={(e) => setSearchPlace(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={() => setOnlyAvailable(!onlyAvailable)}
          />
          Show only available
        </label>
      </div>

      <div className="flex flex-col gap-4">
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-500">No items found.</p>
        ) : (
          filteredItems.map(([id, item]) => (
            <div key={id} className="border rounded shadow p-4 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={item.sharerPhoto}
                  alt="Sharer"
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-semibold">{item.sharerName}</p>
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-xs text-gray-500">📍 {item.address || 'Unknown'}</p>
              <button
                className="mt-2 text-blue-600 hover:underline"
                onClick={() => setSelectedItem({ ...item, id })}
              >
                View More
              </button>
            </div>
          ))
        )}
      </div>

      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};

export default BrowseItems;
