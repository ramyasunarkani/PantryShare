import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../Store/item-actions'; 

const AddItemForm = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !image || !expiryDate) {
      alert('Please fill all required fields');
      return;
    }

    const formData = {
      title,
      description,
      tags,
      image,
      expiryDate,
      address,
    };

    dispatch(addItem(formData));

    setTitle('');
    setDescription('');
    setTags('');
    setImage(null);
    setExpiryDate('');
    setAddress('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto p-4 bg-white shadow rounded">
      <input className="border p-2 rounded" placeholder="Item Name" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="border p-2 rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="border p-2 rounded" placeholder="Tags (comma-separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
      <input className="border p-2 rounded" placeholder="Address (optional)" value={address} onChange={(e) => setAddress(e.target.value)} />
      <input type="datetime-local" className="border p-2 rounded" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
      <input type="file" accept="image/*" className="border p-2 rounded" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Share Item</button>
    </form>
  );
};

export default AddItemForm;
