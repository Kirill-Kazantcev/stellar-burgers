import { combineSlices } from '@reduxjs/toolkit';
import {
  constructorSlice,
  feedSlice,
  ingredientsSlice,
  orderSlice,
  ordersSlice,
  userSlice
} from './slices';
import feedSocketReducer from './slices/feedSocketSlice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  orderSlice,
  feedSlice,
  ordersSlice,
  userSlice,
  {
    feedSocket: feedSocketReducer
  }
);
