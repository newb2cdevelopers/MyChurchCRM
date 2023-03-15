import { createSlice } from "@reduxjs/toolkit";

export const bookingSlice = createSlice({
    name: 'bookings',
    initialState :{
        selectedEventIdForBooking: null
    },
    reducers: {
        selectedEventIdForBooking: (state, action) => {
            state.selectedEventIdForBooking = action.payload.selectedEventId;
        }
    }
});

export const { selectedEventIdForBooking } = bookingSlice.actions;

export default bookingSlice.reducer;