import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserItems, deleteItem, updateItem } from "../Store/item-actions";
import { toast } from "react-toastify";

const YourItems = () => {
  const dispatch = useDispatch();
  const { userItems } = useSelector((state) => state.items);
  const [editingItem, setEditingItem] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    title: "",
    description: "",
    address: "",
    expiryDate: "",
  });

  useEffect(() => {
    dispatch(fetchUserItems());
  }, [dispatch]);

  const handleEditClick = (item) => {
    setEditingItem(item);
    setUpdatedData({
      title: item.title,
      description: item.description,
      address: item.address,
      expiryDate: item.expiryDate?.slice(0, 16),
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      dispatch(deleteItem(id));
      toast.success("Item deleted successfully!");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateItem(editingItem._id, updatedData));
      toast.success("Item updated successfully!");
      setEditingItem(null);
    } catch {
      toast.error("Failed to update item");
    }
  };

  if (!userItems || userItems.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600 text-lg">
        You haven’t shared any items yet.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-green-700 text-center">
        Your Shared Items
      </h2>

      <div className="space-y-6">
        {userItems.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row">
              <img
                src={item.imageUrl || "https://via.placeholder.com/400x250"}
                alt={item.title}
                className="w-full sm:w-1/3 h-52 sm:h-56 object-cover"
              />

              <div className="flex-1 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                  {item.description}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  <strong>Address:</strong> {item.address}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-3">
                  <strong>Expiry:</strong>{" "}
                  {new Date(item.expiryDate).toLocaleString()}
                </p>

                <div className="flex flex-wrap justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="px-3 sm:px-4 py-2   text-blue-800 text-sm cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 sm:px-4 py-2  text-red-800 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
          <div className="bg-white p-5 sm:p-6 rounded-2xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 text-center">
              Edit Item
            </h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={updatedData.title}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, title: e.target.value })
                  }
                  className="w-full border text-gray-700 p-2 rounded-md focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={updatedData.description}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full border text-gray-700 p-2 rounded-md focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={updatedData.address}
                  onChange={(e) =>
                    setUpdatedData({ ...updatedData, address: e.target.value })
                  }
                  className="w-full border text-gray-700 p-2 rounded-md focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Expiry Date
                </label>
                <input
                  type="datetime-local"
                  value={updatedData.expiryDate}
                  onChange={(e) =>
                    setUpdatedData({
                      ...updatedData,
                      expiryDate: e.target.value,
                    })
                  }
                  className="w-full border text-gray-700 p-2 rounded-md focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 sm:px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm sm:text-base"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourItems;
