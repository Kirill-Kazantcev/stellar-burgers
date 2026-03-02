import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { getErrorMessage } from '../utils';
import type { RootState } from '../store';
import { getFeeds } from './feedSlice';
import { getOrders } from './ordersSlice';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredientIds, { rejectWithValue, dispatch }) => {
  try {
    const data = await orderBurgerApi(ingredientIds);
    dispatch(getFeeds());
    dispatch(getOrders());
    return data.order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(number);
    if (!data?.success || data.orders.length === 0) {
      return rejectWithValue('Заказ не найден');
    }
    return data.orders[0];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  selectors: {
    orderRequestSelector: (state) => state.orderRequest,
    orderModalDataSelector: (state) => state.orderModalData,
    currentOrderSelector: (state) => state.currentOrder,
    orderLoadingSelector: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || 'Не удалось оформить заказ';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Не удалось получить заказ';
      });
  }
});

export const { closeOrderModal, clearCurrentOrder } = orderSlice.actions;
export const {
  currentOrderSelector,
  orderLoadingSelector,
  orderModalDataSelector,
  orderRequestSelector
} = orderSlice.selectors;

export const orderByNumberSelector =
  (number?: number) => (state: RootState) => {
    if (!number) {
      return null;
    }

    return (
      state.feed.orders.find((order) => order.number === number) ||
      state.orders.orders.find((order) => order.number === number) ||
      null
    );
  };
