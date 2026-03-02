import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { getErrorMessage } from '../utils';
import type { RootState } from '../store';

type TIngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/getIngredients', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    ingredientsSelector: (state) => state.items,
    ingredientsLoadingSelector: (state) => state.loading,
    ingredientsErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Не удалось загрузить ингредиенты';
      });
  }
});

export const {
  ingredientsSelector,
  ingredientsLoadingSelector,
  ingredientsErrorSelector
} = ingredientsSlice.selectors;

export const ingredientByIdSelector = (id?: string) => (state: RootState) =>
  state.ingredients.items.find((item) => item._id === id);
