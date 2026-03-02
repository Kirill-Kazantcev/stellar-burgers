import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TFeedSocketState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
};

const initialState: TFeedSocketState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null
};

export const feedSocketSlice = createSlice({
  name: 'feedSocket',
  initialState,
  reducers: {
    wsConnectionStart: (state, action: PayloadAction<string | undefined>) => {
      state.error = null;
    },
    wsConnectionClose: (state) => {
      state.isConnected = false;
    },
    wsConnectionSuccess: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    wsConnectionError: (state, action: PayloadAction<string>) => {
      state.isConnected = false;
      state.error = action.payload;
    },
    wsConnectionClosed: (state) => {
      state.isConnected = false;
    },
    wsGetMessage: (
      state,
      action: PayloadAction<{
        orders: TOrder[];
        total: number;
        totalToday: number;
      }>
    ) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  }
});

export const {
  wsConnectionStart,
  wsConnectionClose,
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage
} = feedSocketSlice.actions;

export default feedSocketSlice.reducer;
