import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  feedItems: [],
  selectedFeedItem: null,
  loading: false,
  error: null,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFeedItems: (state, action) => {
      state.feedItems = action.payload;
    },
    addFeedItem: (state, action) => {
      state.feedItems.unshift(action.payload);
    },
    updateFeedItem: (state, action) => {
      const index = state.feedItems.findIndex(
        item => item._id === action.payload._id
      );
      if (index !== -1) {
        state.feedItems[index] = action.payload;
      }
    },
    deleteFeedItem: (state, action) => {
      state.feedItems = state.feedItems.filter(
        item => item._id !== action.payload
      );
    },
    setSelectedFeedItem: (state, action) => {
      state.selectedFeedItem = action.payload;
    },
    likeFeedItem: (state, action) => {
      const index = state.feedItems.findIndex(
        item => item._id === action.payload._id
      );
      if (index !== -1) {
        state.feedItems[index].likes = action.payload.likes;
      }
    },
    addComment: (state, action) => {
      const index = state.feedItems.findIndex(
        item => item._id === action.payload._id
      );
      if (index !== -1) {
        state.feedItems[index].comments = action.payload.comments;
      }
    },
    deleteComment: (state, action) => {
      const { feedItemId, commentId } = action.payload;
      const feedItemIndex = state.feedItems.findIndex(
        item => item._id === feedItemId
      );
      if (feedItemIndex !== -1) {
        state.feedItems[feedItemIndex].comments = 
          state.feedItems[feedItemIndex].comments.filter(
            comment => comment._id !== commentId
          );
      }
    }
  },
});

export const { 
  setLoading, 
  setError, 
  setFeedItems, 
  addFeedItem, 
  updateFeedItem, 
  deleteFeedItem, 
  setSelectedFeedItem,
  likeFeedItem,
  addComment,
  deleteComment
} = communitySlice.actions;

export default communitySlice.reducer;
