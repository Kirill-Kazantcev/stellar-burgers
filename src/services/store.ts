import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { rootReducer } from './rootReducer';
import { socketMiddleware } from './middleware/socket-middleware';
import { WS_FEED_URL } from '../utils/constants';
import {
  wsConnectionStart,
  wsConnectionClose,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage
} from './slices/feedSocketSlice';

const feedMiddleware = socketMiddleware(WS_FEED_URL, {
  wsInit: wsConnectionStart.type,
  wsClose: wsConnectionClose.type,
  onOpen: wsConnectionSuccess.type,
  onError: wsConnectionError.type,
  onMessage: wsGetMessage.type,
  onClose: wsConnectionClosed.type
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
