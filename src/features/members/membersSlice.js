import { createSlice } from "@reduxjs/toolkit";

export const membersSlice = createSlice({
    name: 'members',
    initialState :{
        selectedMemberData: null,
    },
    reducers: {
        selectedMemberData: (state, action) => {
            state.selectedMemberData = action.payload.selectedMemberData;
        }
    }
});

export const { setSelectedMember, selectedMemberData } = membersSlice.actions;

export default membersSlice.reducer;

