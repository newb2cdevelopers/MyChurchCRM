import { createSlice } from "@reduxjs/toolkit";

export const eventsSlice = createSlice({
    name: 'events',
    initialState :{
        selectedEventId: null,
        selectedEventDetails: null,
    },
    reducers: {
        setSelectedEvent: (state, action) => {
            state.selectedEventId = action.payload.selectedEventId;
        },
        selectEventDetails: (state, action) => {
            state.selectedEventDetails = action.payload.selectedEventDetails;
        }
    }
});

export const { setSelectedEvent, selectEventDetails } = eventsSlice.actions;

export default eventsSlice.reducer;

