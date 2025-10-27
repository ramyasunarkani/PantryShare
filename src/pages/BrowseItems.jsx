import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../Store/item-actions";
import { reserveItem } from "../Store/reservation-actions";
import { toast } from "react-toastify";
import Modal from "../components/UI/Modal";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const BrowseItems = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.items);
  const { userId } = useSelector((state) => state.auth);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting location:", error)
    );
  }, []);

  const handleOpenModal = (item) => setSelectedItem(item);
  const handleCloseModal = () => setSelectedItem(null);

  const handleReserve = (item) => {
    if (item.sharerId?._id === userId) {
      toast.error("You cannot reserve your own shared item!");
      return;
    }
    if (new Date(item.expiryDate) < new Date()) {
      toast.error("This item has expired and cannot be reserved.");
      return;
    }
    dispatch(reserveItem(item._id));
    handleCloseModal();
  };

  // ✅ Filter items
  // ✅ Filter items
const filteredItems = items.filter((item) => {
  const query = searchQuery.toLowerCase();
  const isExpired = new Date(item.expiryDate) < new Date();
  const matchesSearch =
    item.title?.toLowerCase().includes(query) ||
    item.description?.toLowerCase().includes(query) ||
    item.address?.toLowerCase().includes(query);

  if (showAll) {
    // Show only expired or reserved items
    return (isExpired || item.status === "reserved") && matchesSearch;
  }

  // Default: show available & non-expired items
  return item.status === "available" && !isExpired && matchesSearch;
});


  const GOOGLE_MAPS_API_KEY = "AIzaSyCj1BOABIiLvrvTLpmkvuVi8EQDt_NX9yM";

  return (
    <>
      <NavBar />
      <div className="pt-24 px-4 pb-12 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-semibold mb-6 text-center text-green-700">
          Browse Shared Items
        </h2>

        {/* 🔍 Search + Filter */}
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Search by title, description, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 rounded-lg border text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={showAll}
              onChange={() => setShowAll((prev) => !prev)}
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            Show expired & reserved
          </label>
        </div>

        {/* 🟢 Items Section */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {!filteredItems.length ? (
            <div className="text-center text-gray-600 mt-10">
              No items found matching your search.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isExpired = new Date(item.expiryDate) < new Date();

              return (
                <div
                  key={item._id}
                  className={`relative bg-white shadow-md rounded-xl overflow-hidden border p-4 md:p-6 hover:shadow-lg transition-all ${
                    isExpired ? "border-red-400 opacity-80" : "border-gray-200"
                  }`}
                >
                  {isExpired && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Expired
                    </div>
                  )}
                  {item.status === "reserved" && !isExpired && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Reserved
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={
                        item.imageUrl || "https://via.placeholder.com/400x250"
                      }
                      alt={item.title}
                      className="w-full md:w-1/3 h-56 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Address: {item.address}
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Expiry:{" "}
                        {item.expiryDate
                          ? new Date(item.expiryDate).toLocaleString()
                          : "N/A"}
                      </p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                        >
                          View Details
                        </button>
                        <span className="text-xs text-gray-500">
                          Shared by: {item.sharerId?.fullName || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 🟢 Modal */}
      {/* 🟢 Modal */}
{selectedItem && (
  <Modal onClose={handleCloseModal}>
    <div className="p-4">
      {/* 🔹 Header with Close Button */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-2xl font-semibold text-gray-800">
          {selectedItem.title}
        </h3>
        <button
          onClick={handleCloseModal}
          className="text-gray-500 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>
      </div>

      {/* 🔹 Owner Info */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={selectedItem.sharerId?.photoURL || "/avatar.png"}
          alt={selectedItem.sharerId?.fullName || "User"}
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <p className="text-gray-800 font-semibold">
            {selectedItem.sharerId?.fullName || "Unknown"}
          </p>
          <p className="text-sm text-gray-500">
            {selectedItem.sharerId?.email || ""}
          </p>
        </div>
      </div>

      {/* 🔹 Item Image */}
      <img
        src={selectedItem.imageUrl || "https://via.placeholder.com/400x250"}
        alt={selectedItem.title}
        className="w-full h-56 object-cover rounded-md mb-4"
      />

      {/* 🔹 Item Details */}
      <p className="text-gray-700 mb-2">
        <strong>Description:</strong> {selectedItem.description}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Address:</strong> {selectedItem.address || "Not provided"}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Expiry Date:</strong>{" "}
        {selectedItem.expiryDate
          ? new Date(selectedItem.expiryDate).toLocaleString()
          : "N/A"}
      </p>

      {/* 🔹 Google Map */}
      {userLocation && selectedItem.location ? (
        <div className="my-6">
          <h4 className="text-lg font-semibold mb-2 text-gray-800">
            Route to Item Location
          </h4>
          <iframe
            width="100%"
            height="300"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedItem.location.lat},${selectedItem.location.lng}`}
            className="rounded-md border border-gray-300"
            title="Google Maps Route"
          ></iframe>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">
          Location data not available for this item or user.
        </p>
      )}

      {/* 🔹 Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleCloseModal}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-700"
        >
          Close
        </button>

        {new Date(selectedItem.expiryDate) < new Date() ? (
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
          >
            Expired
          </button>
        ) : selectedItem.sharerId?._id !== userId &&
          selectedItem.status === "available" ? (
          <button
            onClick={() => handleReserve(selectedItem)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            Reserve
          </button>
        ) : (
          <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
          >
            {selectedItem.sharerId?._id === userId
              ? "Your Item"
              : "Reserved"}
          </button>
        )}
      </div>
    </div>
  </Modal>
)}
<Footer/>

    </>
  );
};

export default BrowseItems;
