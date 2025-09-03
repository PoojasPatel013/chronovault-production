import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timeCapsules: [],
  selectedTimeCapsule: null,
  loading: false,
  error: null,
};

const timeCapsuleSlice = createSlice({
  name: 'timeCapsule',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setTimeCapsules: (state, action) => {
      state.timeCapsules = action.payload;
    },
    addTimeCapsule: (state, action) => {
      state.timeCapsules.unshift(action.payload);
    },
    updateTimeCapsule: (state, action) => {
      const index = state.timeCapsules.findIndex(
        capsule => capsule._id === action.payload._id
      );
      if (index !== -1) {
        state.timeCapsules[index] = action.payload;
      }
    },
    deleteTimeCapsule: (state, action) => {
      state.timeCapsules = state.timeCapsules.filter(
        capsule => capsule._id !== action.payload
      );
    },
    setSelectedTimeCapsule: (state, action) => {
      state.selectedTimeCapsule = action.payload;
    },
  },
});

export const { 
  setLoading, 
  setError, 
  setTimeCapsules,
  addTimeCapsule,
  updateTimeCapsule,
  deleteTimeCapsule,
  setSelectedTimeCapsule 
} = timeCapsuleSlice.actions;

export default timeCapsuleSlice.reducer;
