import { createSlice } from "@reduxjs/toolkit";

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState :{
        selectedModuleRoutes: [],
    },
    reducers: {
        setSelectedModuleRoutes: (state, action) => {
            state.selectedModuleRoutes = action.payload.selectedModuleRoutes;
        }
    }
});

export const { setSelectedModuleRoutes } = navigationSlice.actions;

export default navigationSlice.reducer;