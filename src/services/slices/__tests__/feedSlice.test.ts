import {
  feedSlice,
  getFeeds,
  setFeedData,
  feedOrdersSelector,
  feedTotalSelector,
  feedTotalTodaySelector,
  feedLoadingSelector,
  feedErrorSelector
} from '../feedSlice';
import { TOrder } from '@utils-types';

// Подменяем API на тестовую версию
jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('feedSlice', () => {
  // Начальное состояние - пустая лента
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  // Тестовые данные
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      number: 1,
      name: 'Заказ 1',
      status: 'done',
      createdAt: '2026-01-01T12:00:00Z',
      updatedAt: '2026-01-01T12:00:00Z',
      ingredients: ['ingredient1', 'ingredient2']
    },
    {
      _id: '2',
      number: 2,
      name: 'Заказ 2',
      status: 'pending',
      createdAt: '2026-01-01T13:00:00Z',
      updatedAt: '2026-01-01T13:00:00Z',
      ingredients: ['ingredient3', 'ingredient4']
    }
  ];

  const mockFeedData = {
    orders: mockOrders,
    total: 100,
    totalToday: 10
  };

  const mockErrorMessage = 'Ошибка загрузки ленты';

  // Проверяем начальное состояние
  test('должен возвращать начальное состояние', () => {
    expect(feedSlice.reducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('setFeedData', () => {
    test('должен обновлять данные ленты', () => {
      const action = setFeedData(mockFeedData);
      const state = feedSlice.reducer(initialState, action);

      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('getFeeds', () => {
    test('должен включать загрузку при pending', () => {
      const action = { type: getFeeds.pending.type };
      const state = feedSlice.reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('должен сохранять данные при успехе', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: mockFeedData
      };
      const state = feedSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.error).toBeNull();
    });

    test('должен сохранять ошибку при неудаче', () => {
      const action = {
        type: getFeeds.rejected.type,
        payload: mockErrorMessage
      };
      const state = feedSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(mockErrorMessage);
      expect(state.orders).toEqual([]);
    });

    test('должен показывать стандартную ошибку, если нет описания', () => {
      const action = {
        type: getFeeds.rejected.type
      };
      const state = feedSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Не удалось загрузить ленту');
    });
  });

  describe('селекторы', () => {
    // Полное состояние приложения для тестов
    const fullState = {
      feed: {
        orders: mockOrders,
        total: 100,
        totalToday: 10,
        loading: true,
        error: mockErrorMessage
      },
      ingredients: {
        items: [],
        loading: false,
        error: null
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

    test('feedOrdersSelector должен отдавать список заказов', () => {
      const result = feedOrdersSelector(fullState);
      expect(result).toEqual(mockOrders);
    });

    test('feedTotalSelector должен отдавать общее количество', () => {
      const result = feedTotalSelector(fullState);
      expect(result).toBe(100);
    });

    test('feedTotalTodaySelector должен отдавать количество за сегодня', () => {
      const result = feedTotalTodaySelector(fullState);
      expect(result).toBe(10);
    });

    test('feedLoadingSelector должен показывать статус загрузки', () => {
      const result = feedLoadingSelector(fullState);
      expect(result).toBe(true);
    });

    test('feedErrorSelector должен показывать ошибку', () => {
      const result = feedErrorSelector(fullState);
      expect(result).toBe(mockErrorMessage);
    });
  });
});
