import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { genericGetService, getAuthHeaders } from '../../api/externalServices';
import { B2C_BASE_URL } from '../../constants';

export const fetchLevels = createAsyncThunk(
  'levels/fetchLevels',
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState();
    if (!user.token) {
      return rejectWithValue('No auth token');
    }

    const headers = getAuthHeaders(user.token);
    const [data, error] = await genericGetService(
      `${B2C_BASE_URL}/sundaySchool/level`,
      headers,
    );

    if (error || !data) {
      return rejectWithValue(error?.message || 'Failed to fetch levels');
    }

    return data;
  },
);

const levelsSlice = createSlice({
  name: 'levels',
  initialState: {
    items: [],
    lastFetched: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearLevels: state => {
      state.items = [];
      state.lastFetched = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLevels.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.lastFetched = Date.now();
      })
      .addCase(fetchLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLevels } = levelsSlice.actions;

export const selectLevels = state => state.levels.items;
export const selectLevelsLastFetched = state => state.levels.lastFetched;
export const selectLevelsLoading = state => state.levels.loading;
export const selectLevelsError = state => state.levels.error;

export default levelsSlice.reducer;
