import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { getErrorMessage } from '../utils';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void,
  { rejectValue: string }
>('feed/getFeeds', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday
    };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeedData: (
      state,
      action: {
        payload: {
          orders: TOrder[];
          total: number;
          totalToday: number;
        };
      }
    ) => {
      state.loading = false;
      state.error = null;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  },
  selectors: {
    feedOrdersSelector: (state) => state.orders,
    feedTotalSelector: (state) => state.total,
    feedTotalTodaySelector: (state) => state.totalToday,
    feedLoadingSelector: (state) => state.loading,
    feedErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Не удалось загрузить ленту';
      });
  }
});

export const {
  feedLoadingSelector,
  feedOrdersSelector,
  feedTotalSelector,
  feedTotalTodaySelector,
  feedErrorSelector
} = feedSlice.selectors;
export const { setFeedData } = feedSlice.actions;
