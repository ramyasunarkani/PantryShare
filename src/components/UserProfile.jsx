import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { editProfile } from "../Store/auth-actions";

const UserProfile = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.name || "");
  const [email,setEmail] = useState(user.email || "");
  const [photo, setPhoto] = useState(user.photo || "");
  const [preview, setPreview] = useState(user.photo || "");
  const [location, setLocation] = useState(user.location || { lat: "", lng: "" });
  useEffect(() => {
  setFullName(user.name || "");
  setEmail(user.email||"")
  setPhoto(user.photo || "");
  setPreview(user.photo || "");
  setLocation(user.location || { lat: "", lng: "" });
}, [user]);

  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported!");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        toast.success("Location updated!");
      },
      () => toast.error("Unable to get location.")
    );
  };

  const handleSave = async () => {
  try {
    setLoading(true);

    const updatedData = {
      fullName,
      photo,
      location,
    };

    await dispatch(editProfile(updatedData));

    toast.success("Profile updated successfully!");
    setIsEditing(false);
  } catch (err) {
    toast.error("Update failed!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        User Profile
      </h2>

      <div className="flex flex-col items-center mb-6">
        <img
          src={preview || "/avatar.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-green-400 object-cover shadow-sm"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="file-input file-input-bordered w-full max-w-xs mt-3"
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          readOnly={!isEditing}
          className={`input input-bordered w-full ${
            !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-800" : ""
          }`}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="input input-bordered w-full text-gray-800 bg-gray-100 cursor-not-allowed"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-1">Location</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={
              location.lat && location.lng
                ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
                : ""
            }
            placeholder="Latitude, Longitude"
            readOnly
            className="input input-bordered flex-1 bg-gray-50 text-gray-800 placeholder-gray-400"
          />
          {isEditing && (
            <button
              onClick={handleGetLocation}
              className="btn btn-outline btn-success whitespace-nowrap"
            >
              Get Location
            </button>
          )}
        </div>
      </div>


      <div className="flex justify-between">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary w-full"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3 w-full">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-success flex-1"
            >
              {loading ? "Saving..." : "Update"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
