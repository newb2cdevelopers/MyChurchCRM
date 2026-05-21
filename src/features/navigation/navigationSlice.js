import { createSlice } from '@reduxjs/toolkit';

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    selectedModuleRoutes: [],
    selectedModuleName: '',
  },
  reducers: {
    setSelectedModule: (state, action) => {
      state.selectedModuleRoutes = action.payload.selectedModuleRoutes || [];
      state.selectedModuleName = action.payload.selectedModuleName || '';
    },
  },
});

export const { setSelectedModule } = navigationSlice.actions;

export default navigationSlice.reducer;
