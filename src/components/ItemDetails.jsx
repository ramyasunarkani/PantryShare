import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchItemById, fetchItems } from "../Store/item-actions";
import { reserveItem } from "../Store/reservation-actions";
import { toast } from "react-toastify";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const GOOGLE_MAPS_API_KEY = "AIzaSyCj1BOABIiLvrvTLpmkvuVi8EQDt_NX9yM";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, selectedItem } = useSelector((state) => state.items);
  const { userId } = useSelector((state) => state.auth);

  const [item, setItem] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      if (!items.length) {
        await dispatch(fetchItems());
      }

      let foundItem = items.find((i) => i._id === id);
      if (!foundItem) {
        await dispatch(fetchItemById(id));
      } else {
        setItem(foundItem);
      }
    };

    loadItem();
  }, [dispatch, id, items]);

  useEffect(() => {
    if (selectedItem && selectedItem._id === id) {
      setItem(selectedItem);
    }
  }, [selectedItem, id]);

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

  useEffect(() => {
    if (userLocation && item?.location) {
      const R = 6371;
      const dLat = (item.location.lat - userLocation.lat) * (Math.PI / 180);
      const dLng = (item.location.lng - userLocation.lng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(userLocation.lat * (Math.PI / 180)) *
          Math.cos(item.location.lat * (Math.PI / 180)) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      setDistance((R * c).toFixed(2));
    }
  }, [userLocation, item]);

  const handleReserve = () => {
    if (!item) return;
    if (item.sharerId?._id === userId) {
      toast.error("You cannot reserve your own shared item!");
      return;
    }
    if (new Date(item.expiryDate) < new Date()) {
      toast.error("This item has expired and cannot be reserved.");
      return;
    }
    dispatch(reserveItem(item._id));
    navigate("/browse");
  };

  if (!item)
    return (
      <div className="text-center mt-20 text-gray-600">
        Loading item details...
      </div>
    );

  const isExpired = new Date(item.expiryDate) < new Date();
  const isOwner = item.sharerId?._id === userId;
  const isAvailable = item.status === "available";
  const isReserver =
    item.reservedBy === userId || item.reservedBy?._id === userId;

  return (
    <>
      <NavBar />
      <div className="pt-20 bg-gray-50 min-h-screen text-gray-800">
        <div className="max-w-6xl mx-auto px-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4">
          <img
            src={item.imageUrl || "https://via.placeholder.com/800x400"}
            alt={item.title}
            className="w-[70%] h-80 sm:h-[450px] object-cover rounded-xl shadow-sm mb-8"
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-semibold">{item.title}</h2>
            <span
              className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-medium rounded-full ${
                isExpired
                  ? "bg-red-500 text-white"
                  : item.status === "reserved"
                  ? "bg-yellow-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {isExpired ? "Expired" : item.status || "Available"}
            </span>
          </div>

          <p className="text-lg leading-relaxed">{item.description}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
            <p>
              <strong>Address:</strong> {item.address || "Not provided"}
            </p>
            <p>
              <strong>Expiry Date:</strong>{" "}
              {item.expiryDate
                ? new Date(item.expiryDate).toLocaleString()
                : "N/A"}
            </p>
            {distance && (
              <p>
                <strong>Distance:</strong> {distance} km
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
            <img
              src={item.sharerId?.photoURL || "/avatar.png"}
              alt={item.sharerId?.fullName || "User"}
              className="w-14 h-14 rounded-full border object-cover"
            />
            <div>
              <p className="font-semibold">
                {item.sharerId?.fullName || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">
                {item.sharerId?.email || ""}
              </p>
            </div>
          </div>

          {userLocation && item.location ? (
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-3">
                Route to Item Location
              </h4>
              <iframe
                width="100%"
                height="400"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${userLocation.lat},${userLocation.lng}&destination=${item.location.lat},${item.location.lng}`}
                className="rounded-lg border border-gray-300 shadow-sm"
                title="Google Maps Route"
              ></iframe>
            </div>
          ) : (
            <p className="text-gray-500">
              Location data not available for this item or user.
            </p>
          )}

          <div className="flex justify-end mt-8 pb-10 gap-4">
            {isExpired ? (
              <button
                disabled
                className="px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
              >
                Expired
              </button>
            ) : isOwner ? (
              item.reservedBy ? (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                >
                  Reserved by someone
                </button>
              ) : (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                >
                  Your Item
                </button>
              )
            ) : isReserver ? (
              <div className="flex flex-col items-end">
                <p className="text-green-600 mb-2 font-semibold">
                  You reserved this item
                </p>
                <button
                  disabled
                  className="px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                >
                  Reserved
                </button>
              </div>
            ) : isAvailable ? (
              <button
                onClick={handleReserve}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
              >
                Reserve
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
              >
                Reserved
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItemDetails;
