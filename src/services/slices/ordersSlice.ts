import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { getErrorMessage } from '../utils';

type TOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const getOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/getOrders', async (_, { rejectWithValue }) => {
  try {
    const data = await getOrdersApi();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    ordersSelector: (state) => state.orders,
    ordersLoadingSelector: (state) => state.loading,
    ordersErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Не удалось загрузить историю заказов';
      });
  }
});

export const { ordersErrorSelector, ordersLoadingSelector, ordersSelector } =
  ordersSlice.selectors;
