import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../Store/item-actions";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const BrowseItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.items);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);
  
  
const filteredItems = items.filter((item) => {
  const query = searchQuery.toLowerCase();
  const isExpired = new Date(item.expiryDate) < new Date();
  const matchesSearch =
    item.title?.toLowerCase().includes(query) ||
    item.description?.toLowerCase().includes(query) ||
    item.address?.toLowerCase().includes(query);

  if (showAll) {
    return (isExpired || item.status === "reserved") && matchesSearch;
  }

  return item.status === "available" && !isExpired && matchesSearch;
});

  return (
    <>
      <NavBar />
      <div className="pt-24 px-4 pb-12 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-semibold mb-6 text-center text-green-700">
          Browse Shared Items
        </h2>

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
                  {item.status === "reserved" ? (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Reserved
                    </div>
                  ) : isExpired ? (
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      Expired
                    </div>
                  ) : null}


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
                          onClick={() => navigate(`/item/${item._id}`)}
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
<Footer/>

    </>
  );
};

export default BrowseItems;
