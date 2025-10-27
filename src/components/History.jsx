import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReservations } from "../Store/reservation-actions";

const History = () => {
  const dispatch = useDispatch();
  const { userReservations, loading } = useSelector(
    (state) => state.reservation
  );

  useEffect(() => {
    dispatch(fetchUserReservations());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-green-600 font-medium">
        Loading your reservations...
      </div>
    );
  }

  if (!userReservations || userReservations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        You haven’t reserved any items yet.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-green-700 text-center">
        My Reservation History
      </h2>

      <div className="flex flex-col gap-5">
        {userReservations.map((r) => (
          <div
            key={r._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              <img
                src={
                  r.itemId?.imageUrl || "https://via.placeholder.com/400x250"
                }
                alt={r.itemId?.title || "Reserved item"}
                className="w-full sm:w-1/3 h-48 object-cover"
              />

              <div className="flex-1 p-5 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {r.itemId?.title || "Untitled Item"}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3">
                  {r.itemId?.description || "No description available."}
                </p>

                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {r.status || "Pending"}
                </p>

                <div className="flex items-center gap-3 mt-2 border-t pt-3">
                  <img
                    src={
                      r.itemId?.sharerId?.photoURL ||
                      "https://via.placeholder.com/40"
                    }
                    alt={r.itemId?.sharerId?.fullName || "Owner"}
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {r.itemId?.sharerId?.fullName || "Unknown Owner"}
                    </p>
                    <p className="text-xs text-gray-500">Item Owner</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Expires:{" "}
                  {r.itemId?.expiryDate
                    ? new Date(r.itemId.expiryDate).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
