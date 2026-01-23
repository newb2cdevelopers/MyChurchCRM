import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userEmail: '',
    token: '',
    selectedChurchId: '',
    roles: [],
    workfront: null,
  },
  reducers: {
    login: (state, action) => {
      state.userEmail = action.payload.userEmail;
      state.token = action.payload.token;
      state.roles = action.payload.roles;
      state.workfront = action.payload.workfront;
    },
    setSelectedChurch: (state, action) => {
      state.selectedChurchId = action.payload.selectedChurchId;
    },
    logout: state => {
      state.userEmail = '';
      state.token = '';
      state.selectedChurchId = '';
      state.roles = [];
      state.workfront = null;
    },
  },
});

export const { login, setSelectedChurch, logout } = userSlice.actions;

export default userSlice.reducer;
