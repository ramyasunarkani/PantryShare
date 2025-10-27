import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userReservations: [],    // Reservations made by logged-in user
  ownerReservations: [],   // Reservations for items the user owns
  loading: false,
  error: null,
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setUserReservations(state, action) {
      state.userReservations = action.payload;
    },
    setOwnerReservations(state, action) {
      state.ownerReservations = action.payload;
    },
    addReservation(state, action) {
      state.userReservations.push(action.payload);
    },
    updateReservation(state, action) {
      const updated = action.payload;
      // Update in userReservations
      state.userReservations = state.userReservations.map((r) =>
        r._id === updated._id ? updated : r
      );
      // Update in ownerReservations
      state.ownerReservations = state.ownerReservations.map((r) =>
        r._id === updated._id ? updated : r
      );
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const reservationActions = reservationSlice.actions;
export default reservationSlice.reducer;
