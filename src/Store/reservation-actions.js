import api from "./api";
import { reservationActions } from "./reservation-slice";
import { toast } from "react-toastify";

// ✅ Reserve an item
export const reserveItem = (itemId) => {
  return async (dispatch) => {
    try {
      dispatch(reservationActions.setLoading(true));
      const res = await api.post(
        "/reservations",
        { itemId },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      dispatch(reservationActions.addReservation(res.data.reservation));
      toast.success("Item reserved successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reserve item");
    } finally {
      dispatch(reservationActions.setLoading(false));
    }
  };
};

// ✅ Update reservation status (only owner)
export const updateReservationStatus = (reservationId, status) => {
  return async (dispatch) => {
    try {
      dispatch(reservationActions.setLoading(true));
      const res = await api.put(
        `/reservations/${reservationId}`,
        { status },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      dispatch(reservationActions.updateReservation(res.data.reservation));
      toast.success(`Reservation ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      dispatch(reservationActions.setLoading(false));
    }
  };
};

// ✅ Fetch reservations of logged-in user
export const fetchUserReservations = () => {
  return async (dispatch) => {
    try {
      dispatch(reservationActions.setLoading(true));
      const res = await api.get("/reservations/my-reservations", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(reservationActions.setUserReservations(res.data));
    } catch (err) {
      console.error(err);
      dispatch(reservationActions.setError(err.message));
    } finally {
      dispatch(reservationActions.setLoading(false));
    }
  };
};

// ✅ Fetch reservations for items owned by logged-in user
export const fetchOwnerReservations = () => {
  return async (dispatch) => {
    try {
      dispatch(reservationActions.setLoading(true));
      const res = await api.get("/reservations/owner-reservations", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      dispatch(reservationActions.setOwnerReservations(res.data));
    } catch (err) {
      console.error(err);
      dispatch(reservationActions.setError(err.message));
    } finally {
      dispatch(reservationActions.setLoading(false));
    }
  };
};
