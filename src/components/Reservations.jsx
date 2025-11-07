import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOwnerReservations,
  updateReservationStatus,
} from "../Store/reservation-actions";
import { MessageCircle } from "lucide-react";
import ChatModal from "../components/ChatModal";

const Reservations = () => {
  const dispatch = useDispatch();
  const { ownerReservations = [], loading = false } = useSelector(
    (state) => state.reservation || {}
  );
  const authUser = useSelector((state) => state.auth);
  const [selectedChatItem, setSelectedChatItem] = useState(null);

  useEffect(() => {
    dispatch(fetchOwnerReservations());
  }, [dispatch]);

  const handleStatusChange = (reservationId, status) => {
    dispatch(updateReservationStatus(reservationId, status));
  };

  if (loading)
    return (
      <div className="text-green-600 text-center mt-6">
        Loading reservations...
      </div>
    );

  if (!ownerReservations.length)
    return (
      <div className="text-gray-500 text-center mt-6">
        No one has reserved your items yet.
      </div>
    );

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-green-700 text-center">
        Reservations on My Items
      </h2>

      <div className="flex flex-col gap-5">
        {ownerReservations.map((r) => (
          <div
            key={r._id}
            className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              <img
                src={r.itemId?.imageUrl || "https://via.placeholder.com/400x250"}
                alt={r.itemId?.title || "Reserved item"}
                className="w-full sm:w-1/3 h-48 object-cover"
              />

              <div className="flex-1 p-5 flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {r.itemId?.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {r.itemId?.description}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  <strong>Reserved by:</strong> {r.userId?.fullName}
                </p>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Status:
                    </label>
                    <select
                      value={r.status}
                      onChange={(e) =>
                        handleStatusChange(r._id, e.target.value)
                      }
                      className={`border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 ${
                        r.status === "PENDING"
                          ? "border-gray-400 text-gray-500 focus:ring-gray-400"
                          : r.status === "APPROVED"
                          ? "border-green-400 text-green-600 focus:ring-green-400"
                          : r.status === "CANCELLED"
                          ? "border-red-400 text-red-600 focus:ring-red-400"
                          : "border-blue-400 text-blue-600 focus:ring-blue-400"
                      }`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>

                  <p className="text-xs text-gray-500">
                    Expires:{" "}
                    {r.itemId?.expiryDate
                      ? new Date(r.itemId.expiryDate).toLocaleString()
                      : "N/A"}
                  </p>

                  <button
                    onClick={() => setSelectedChatItem(r)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
                  >
                    <MessageCircle size={16} />
                    Chat with Reserver
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedChatItem && (
        <ChatModal
          item={selectedChatItem.itemId}
          currentUser={{
            _id: authUser.userId,
            fullName: authUser.name,
            email: authUser.email,
            photoURL: authUser.photo,
          }}
          closeModal={() => setSelectedChatItem(null)}
        />
      )}
    </div>
  );
};

export default Reservations;
