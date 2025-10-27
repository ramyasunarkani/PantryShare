import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOwnerReservations,
  updateReservationStatus,
} from "../Store/reservation-actions";

const Reservations = () => {
  const dispatch = useDispatch();
  const { ownerReservations = [], loading = false } = useSelector(
    (state) => state.reservation || {}
  );

  useEffect(() => {
    dispatch(fetchOwnerReservations());
  }, [dispatch]);

  const handleStatusChange = (reservationId, status) => {
    dispatch(updateReservationStatus(reservationId, status));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-green-600 font-medium">
        Loading reservations...
      </div>
    );
  }

  if (!ownerReservations || ownerReservations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        No one has reserved your items yet.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-green-700 text-center">
        Reservations on My Items
      </h2>

      <div className="flex flex-col gap-5">
        {ownerReservations.map((r) => (
          <div
            key={r._id}
            className={`bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
              new Date(r.itemId?.expiryDate) < new Date()
                ? "opacity-80 border-red-400"
                : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row">
              <img
                src={
                  r.itemId?.imageUrl || "https://via.placeholder.com/400x250"
                }
                alt={r.itemId?.title || "Reserved item"}
                className="w-full sm:w-1/3 h-48 object-cover"
              />

              <div className="flex-1 p-5 flex flex-col gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {r.itemId?.title || "Untitled Item"}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {r.itemId?.description || "No description available."}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  <strong>Reserved by:</strong>{" "}
                  {r.userId?.fullName || "Unknown User"}
                </p>

                <p className="text-sm text-gray-500">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      r.status === "APPROVED"
                        ? "text-green-600"
                        : r.status === "CANCELLED"
                        ? "text-red-600"
                        : r.status === "COMPLETED"
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </p>

                <p className="text-xs text-gray-400">
                  Expires:{" "}
                  {r.itemId?.expiryDate
                    ? new Date(r.itemId.expiryDate).toLocaleString()
                    : "N/A"}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {["APPROVED", "CANCELLED", "COMPLETED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(r._id, status)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        status === "APPROVED"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : status === "CANCELLED"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
