import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../Store/item-actions";
import { toast } from "react-toastify";

const AddItemForm = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => toast.error("Unable to get location.")
      );
    } else {
      toast.error("Geolocation not supported.");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !image || !expiryDate) {
      toast.error("Please fill all required fields.");
      return;
    }

    const formData = {
      title,
      description,
      tags: tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag !== ""),
      image,
      expiryDate,
      address,
      location,
    };

    dispatch(addItem(formData));

    setTitle("");
    setDescription("");
    setTags("");
    setImage(null);
    setExpiryDate("");
    setAddress("");
    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white  flex flex-col gap-5"
    >
      
      <div className="flex flex-col">
        <label htmlFor="itemTitle" className="mb-1 font-medium text-gray-700">
          Item Name *
        </label>
        <input
          id="itemTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter item name"
          className="border border-gray-300 p-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="itemDescription"
          className="mb-1 font-medium text-gray-700"
        >
          Description *
        </label>
        <textarea
          id="itemDescription"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="border border-gray-300 p-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800 resize-none"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="itemTags" className="mb-1 font-medium text-gray-700">
          Tags
        </label>
        <input
          id="itemTags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Comma separated tags (e.g. books, clothes)"
          className="border border-gray-300 p-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="itemAddress" className="mb-1 font-medium text-gray-700">
          Address
        </label>
        <input
          id="itemAddress"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address (optional)"
          className="border border-gray-300 p-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
        />
      </div>

      <div className="flex flex-col">
  <label htmlFor="itemExpiry" className="mb-1 font-medium text-gray-700">
    Expiry Date *
  </label>
  <input
    id="itemExpiry"
    type="datetime-local"
    value={expiryDate}
    onChange={(e) => setExpiryDate(e.target.value)}
    className="border border-gray-300 p-3 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
    style={{ WebkitAppearance: 'textfield' }}
  />
</div>


      <div className="flex flex-col">
        <label htmlFor="itemImage" className="mb-1 font-medium text-gray-700">
          Image *
        </label>
        <input
          id="itemImage"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition font-medium"
      >
        Share Item
      </button>
    </form>
  );
};

export default AddItemForm;
