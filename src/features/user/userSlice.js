import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userEmail: '',
    token: '',
    selectedChurchId: '',
    churchName: '',
    roles: [],
    workfront: null,
    zoneId: null,
  },
  reducers: {
    login: (state, action) => {
      state.userEmail = action.payload.userEmail;
      state.token = action.payload.token;
      state.roles = action.payload.roles;
      state.workfront = action.payload.workfront;
      state.zoneId = action.payload.zoneId || null;
      state.churchName = action.payload.churchName || '';
    },
    setSelectedChurch: (state, action) => {
      state.selectedChurchId = action.payload.selectedChurchId;
    },
    logout: state => {
      state.userEmail = '';
      state.token = '';
      state.selectedChurchId = '';
      state.churchName = '';
      state.roles = [];
      state.workfront = null;
      state.zoneId = null;
    },
  },
});

export const { login, setSelectedChurch, logout } = userSlice.actions;

export default userSlice.reducer;
