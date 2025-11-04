import { toast } from "react-toastify";
import api from "./api";
import { itemActions } from "./item-slice";

export const fetchItems = () => {
  return async (dispatch) => {
    try {
      const res = await api.get("/items",{
        headers: {
          Authorization: localStorage.getItem("token"), 
        },
      });
      dispatch(itemActions.setItems(res.data));
    } catch (err) {
      console.error("Failed to fetch items:", err.message);
    }
  };
};

export const fetchUserItems = () => {
  return async (dispatch) => {
    try {
      const res = await api.get("/items/my-items", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(itemActions.setUserItems(res.data));
    } catch (err) {
      console.error("Failed to fetch user items:", err.message);
    }
  };
};

export const addItem = (itemData) => {
  return async (dispatch) => {
    try {
      const form = new FormData();
      form.append("title", itemData.title);
      form.append("description", itemData.description);
      form.append("address", itemData.address || "");
      form.append("expiryDate", itemData.expiryDate);
      form.append("tags", JSON.stringify(itemData.tags || []));
      form.append("location", JSON.stringify(itemData.location || {}));

      if (itemData.image) {
        form.append("image", itemData.image); 
      }

      const res = await api.post("/items", form, {
        headers: {
          Authorization: localStorage.getItem("token"), 
        },
      });

      dispatch(itemActions.addItem(res.data.item));
      toast.success("Item shared successfully!");
    } catch (err) {
      console.error("Failed to add item:", err.message);
      toast.error("Item failed to share!");
    }
  };
};


export const fetchItemById = (id) => {
  return async (dispatch) => {
    try {
      const res = await api.get(`/items/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      if (res.data) {
        dispatch(itemActions.setSingleItem(res.data));
      }
    } catch (err) {
      console.error("Failed to fetch item by ID:", err.message);
    }
  };
};


export const updateItem = (id, updatedData) => {
  return async (dispatch) => {
    try {
      const form = new FormData();
      if (updatedData.title) form.append("title", updatedData.title);
      if (updatedData.description) form.append("description", updatedData.description);
      if (updatedData.address) form.append("address", updatedData.address);
      if (updatedData.expiryDate) form.append("expiryDate", updatedData.expiryDate);
      if (updatedData.tags) form.append("tags", JSON.stringify(updatedData.tags));
      if (updatedData.location) form.append("location", JSON.stringify(updatedData.location));
      if (updatedData.image) form.append("image", updatedData.image);

      const res = await api.put(`/items/${id}`, form, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      dispatch(itemActions.updateItem(res.data.item));
    } catch (err) {
      console.error("Failed to update item:", err.message);
    }
  };
};

export const deleteItem = (id) => {
  return async (dispatch) => {
    try {
      await api.delete(`/items/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(itemActions.deleteItem(id));
    } catch (err) {
      console.error("Failed to delete item:", err.message);
    }
  };
};
