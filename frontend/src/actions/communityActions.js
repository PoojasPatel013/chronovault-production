import api from '../components/api';
import {
  setFeedItems,
  setLoading,
  setError,
  likeFeedItem as likeItem,
  addComment as addCommentToItem,
} from '../reducers/communityReducer';

// Get all feed items
export const getFeedItems = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await api.get('/community/feed');
    dispatch(setFeedItems(res.data));
  } catch (err) {
    dispatch(setError({
      msg: err.response?.data?.message || err.message,
      status: err.response?.status || 500,
    }));
  } finally {
    dispatch(setLoading(false));
  }
};

// Like a feed item
export const likeFeedItem = (feedItemId) => async (dispatch) => {
  try {
    const res = await api.post(`/community/feed/${feedItemId}/like`);
    dispatch(likeItem(res.data));
  } catch (err) {
    dispatch(setError({
      msg: err.response?.data?.message || err.message,
      status: err.response?.status || 500,
    }));
  }
};

// Add comment to feed item
export const addComment = (feedItemId, content) => async (dispatch) => {
  try {
    const res = await api.post(`/community/feed/${feedItemId}/comments`, { content });
    dispatch(addCommentToItem({ feedItemId, comment: res.data.comments[0] }));
  } catch (err) {
    dispatch(setError({
      msg: err.response?.data?.message || err.message,
      status: err.response?.status || 500,
    }));
  }
};
