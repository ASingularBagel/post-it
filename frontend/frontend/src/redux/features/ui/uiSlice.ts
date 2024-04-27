import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isLoading: false,
    error: null,
    isEditUserOpen: false,
    isLoggingOut: false,
    isPostModalOpen: false,
    isViewingOwnProfile: false, 
    isviewingOtherProfile: false, 
    viewingUser: '',
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setEditUser: (state, action) => {
      state.isEditUserOpen = action.payload 
    }, 
    isUserLoggingOut: (state, action) => {
      state.isLoggingOut = action.payload
    }, 
    setPostModalOpen: (state, action) => {
      state.isPostModalOpen = action.payload
    }, 
    viewingOwnProfile: (state, action) => {
      state.isViewingOwnProfile = action.payload
    },
    viewingOtherProfile: (state, action) => {
      state.isviewingOtherProfile = action.payload
    }, 
    setViewedUser: (state, action) => {
      state.viewingUser = action.payload
    }
  },
});

export const { setLoading, setError, clearError, setEditUser, isUserLoggingOut, setPostModalOpen, viewingOtherProfile, viewingOwnProfile, setViewedUser } = uiSlice.actions;

export default uiSlice.reducer;