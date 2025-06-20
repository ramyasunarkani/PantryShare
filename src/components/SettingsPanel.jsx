import React from 'react';

const SettingsPanel = () => {
  return (
    <div className="flex flex-col gap-3">
      <label>
        <span className="block mb-1">Change Name</span>
        <input className="border p-2 rounded w-full" />
      </label>
      <label>
        <span className="block mb-1">Change Photo URL</span>
        <input className="border p-2 rounded w-full" />
      </label>
      <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
    </div>
  );
};

export default SettingsPanel;
