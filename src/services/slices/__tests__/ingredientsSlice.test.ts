import {
  ingredientsSlice,
  getIngredients,
  ingredientsSelector,
  ingredientsLoadingSelector,
  ingredientsErrorSelector,
  ingredientByIdSelector
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

// Подменяем API на тестовую версию
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice', () => {
  // Начальное состояние - пустой список
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  // Тестовые данные
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: 'image.jpg',
      image_large: 'image-large.jpg',
      image_mobile: 'image-mobile.jpg'
    },
    {
      _id: '2',
      name: 'Начинка',
      type: 'main',
      proteins: 20,
      fat: 20,
      carbohydrates: 20,
      calories: 200,
      price: 200,
      image: 'image.jpg',
      image_large: 'image-large.jpg',
      image_mobile: 'image-mobile.jpg'
    }
  ];

  const mockErrorMessage = 'Ошибка загрузки';

  describe('загрузка ингредиентов', () => {
    test('должен возвращать начальное состояние', () => {
      expect(ingredientsSlice.reducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });

    test('должен включать загрузку при getIngredients.pending', () => {
      const action = { type: getIngredients.pending.type };
      const newState = ingredientsSlice.reducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.items).toEqual([]);
    });

    test('должен сохранять ингредиенты при успехе', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const newState = ingredientsSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.items).toEqual(mockIngredients);
    });

    test('должен сохранять ошибку при неудаче', () => {
      const action = {
        type: getIngredients.rejected.type,
        payload: mockErrorMessage
      };
      const newState = ingredientsSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(mockErrorMessage);
      expect(newState.items).toEqual([]);
    });

    test('должен показывать стандартную ошибку, если нет описания', () => {
      const action = {
        type: getIngredients.rejected.type
      };
      const newState = ingredientsSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Не удалось загрузить ингредиенты');
      expect(newState.items).toEqual([]);
    });
  });

  describe('селекторы', () => {
    // Полное состояние приложения для тестов
    const fullState = {
      ingredients: {
        items: mockIngredients,
        loading: true,
        error: mockErrorMessage
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        loading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      orders: {
        orders: [],
        loading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null,
        loginError: null,
        registerError: null,
        updateUserError: null,
        forgotPasswordError: null,
        resetPasswordError: null
      },
      feedSocket: {
        orders: [],
        total: 0,
        totalToday: 0,
        isConnected: false,
        error: null
      }
    };

    test('ingredientsSelector должен отдавать список ингредиентов', () => {
      const result = ingredientsSelector(fullState);
      expect(result).toEqual(mockIngredients);
    });

    test('ingredientsLoadingSelector должен показывать статус загрузки', () => {
      const result = ingredientsLoadingSelector(fullState);
      expect(result).toBe(true);
    });

    test('ingredientsErrorSelector должен показывать ошибку', () => {
      const result = ingredientsErrorSelector(fullState);
      expect(result).toBe(mockErrorMessage);
    });

    test('ingredientByIdSelector должен находить ингредиент по id', () => {
      const selector = ingredientByIdSelector('1');
      const result = selector(fullState);

      expect(result).toEqual(mockIngredients[0]);
    });

    test('ingredientByIdSelector должен возвращать undefined для чужого id', () => {
      const selector = ingredientByIdSelector('999');
      const result = selector(fullState);

      expect(result).toBeUndefined();
    });

    test('ingredientByIdSelector должен возвращать undefined без id', () => {
      const selector = ingredientByIdSelector(undefined);
      const result = selector(fullState);

      expect(result).toBeUndefined();
    });
  });
});
