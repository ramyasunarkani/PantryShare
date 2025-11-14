import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserReservations } from "../Store/reservation-actions";
import { useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal";
import { MessageCircle } from "lucide-react";

const History = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userReservations, loading } = useSelector(
    (state) => state.reservation
  );
  const authUser = useSelector((state) => state.auth);

  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatItem, setSelectedChatItem] = useState(null);

  useEffect(() => {
    dispatch(fetchUserReservations());
  }, [dispatch]);

  const openChat = (item) => {
    setSelectedChatItem(item);
    setChatOpen(true);
  };

  const closeChat = () => {
    setSelectedChatItem(null);
    setChatOpen(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-green-600 font-medium">
        Loading your reservations...
      </div>
    );

  if (!userReservations || userReservations.length === 0)
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        You haven’t reserved any items yet.
      </div>
    );

  return (
    <div className="relative w-full flex h-screen overflow-hidden">

      <div
        className={`transition-all duration-300 px-4 sm:px-8 overflow-y-auto h-full 
          ${chatOpen ? "md:w-[50%] w-full" : "w-full"}`}
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-green-700 text-center">
          My Reservation History
        </h2>

        <div className="flex flex-col gap-5 pb-10">
          {userReservations.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className={`${chatOpen ? "flex flex-col" : "flex flex-col sm:flex-row"}`}>

                <img
                  src={r.itemId?.imageUrl || "https://via.placeholder.com/400x250"}
                  alt={r.itemId?.title}
                  className={`w-full h-48 object-cover 
                    ${chatOpen ? "rounded-b-none" : "sm:w-1/3"}`}
                />

                <div className="flex-1 p-5 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {r.itemId?.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {r.itemId?.description}
                  </p>

                  <p className="text-sm text-gray-500">
                    <strong>Status:</strong> {r.status}
                  </p>

                  <div className="flex items-center gap-3 mt-2 border-t pt-3">
                    <img
                      src={
                        r.itemId?.sharerId?.photoURL ||
                        "https://via.placeholder.com/40"
                      }
                      alt={r.itemId?.sharerId?.fullName}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {r.itemId?.sharerId?.fullName}
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

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => navigate(`/item/${r.itemId?._id}`)}
                      className="text-sm text-emerald-800 font-medium hover:underline"
                    >
                      View More
                    </button>

                    <button
                      onClick={() => openChat(r.itemId)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <MessageCircle size={16} />
                      Chat with Owner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {chatOpen && selectedChatItem && (
        <>
          <div
            className="
              hidden md:flex flex-col 
              fixed right-0 top-0 bottom-0 
              w-[40%]
              bg-white shadow-xl
              border-l border-gray-300
              z-50
            "
          >
            <ChatModal
              item={selectedChatItem}
              currentUser={{
                _id: authUser.userId,
                fullName: authUser.name,
                email: authUser.email,
                photoURL: authUser.photo,
              }}
              closeModal={closeChat}
            />
          </div>

          <div className="md:hidden fixed inset-0 bg-white z-50">
            <ChatModal
              item={selectedChatItem}
              currentUser={{
                _id: authUser.userId,
                fullName: authUser.name,
                email: authUser.email,
                photoURL: authUser.photo,
              }}
              closeModal={closeChat}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default History;
