import { configureStore } from '@reduxjs/toolkit';
import communityReducer from '../reducers/communityReducer';
import timeCapsuleReducer from '../reducers/timeCapsuleReducer';
import authReducer from '../reducers/authReducer';

export const store = configureStore({
  reducer: {
    community: communityReducer,
    timeCapsule: timeCapsuleReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
