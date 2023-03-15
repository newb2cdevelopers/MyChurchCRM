import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "../features/user/userSlice";
import  eventsReducer  from "../features/events/eventsSlice";
import bookingsReducer from "../features/bookings/bookingSlice";
import  membersReducer  from '../features/members/membersSlice';
import navigationSlice from "../features/navigation/navigationSlice";

export default configureStore({
    reducer: {
        user: userReducer,
        events: eventsReducer,
        bookings: bookingsReducer,
        members: membersReducer,
        navigation: navigationSlice
    },
    devTools: process.env.REACT_APP_NODE_ENV !== 'production',
})