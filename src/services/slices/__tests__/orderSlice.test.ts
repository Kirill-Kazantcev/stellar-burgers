import {
  orderSlice,
  createOrder,
  getOrderByNumber,
  closeOrderModal,
  clearCurrentOrder,
  orderRequestSelector,
  orderModalDataSelector,
  currentOrderSelector,
  orderLoadingSelector,
  orderByNumberSelector
} from '../orderSlice';
import { TOrder } from '@utils-types';

// Подменяем API на тестовую версию
jest.mock('@api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

// Подменяем вызовы обновления списков
jest.mock('../feedSlice', () => ({
  getFeeds: jest.fn(() => ({ type: 'feed/getFeeds' }))
}));

jest.mock('../ordersSlice', () => ({
  getOrders: jest.fn(() => ({ type: 'orders/getOrders' }))
}));

describe('orderSlice', () => {
  // Начальное состояние
  const initialState = {
    orderRequest: false, // идет создание заказа?
    orderModalData: null, // данные для модалки
    currentOrder: null, // текущий заказ
    loading: false, // загрузка
    error: null // ошибка
  };

  // Тестовые данные
  const mockOrder: TOrder = {
    _id: 'order123',
    number: 12345,
    name: 'Космический бургер',
    status: 'done',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
    ingredients: ['1', '2', '3']
  };

  const mockErrorMessage = 'Ошибка создания заказа';

  test('должен возвращать начальное состояние', () => {
    expect(orderSlice.reducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('синхронные экшены', () => {
    test('closeOrderModal должен закрывать модалку', () => {
      const stateWithModal = {
        ...initialState,
        orderModalData: mockOrder
      };

      const action = closeOrderModal();
      const newState = orderSlice.reducer(stateWithModal, action);

      expect(newState.orderModalData).toBeNull();
    });

    test('clearCurrentOrder должен очищать текущий заказ', () => {
      const stateWithCurrentOrder = {
        ...initialState,
        currentOrder: mockOrder
      };

      const action = clearCurrentOrder();
      const newState = orderSlice.reducer(stateWithCurrentOrder, action);

      expect(newState.currentOrder).toBeNull();
    });
  });

  describe('createOrder', () => {
    test('должен включать создание при pending', () => {
      const action = { type: createOrder.pending.type };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.orderRequest).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('должен сохранять заказ при успехе', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.orderModalData).toEqual(mockOrder);
    });

    test('должен сохранять ошибку при неудаче', () => {
      const action = {
        type: createOrder.rejected.type,
        payload: mockErrorMessage
      };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.error).toBe(mockErrorMessage);
    });

    test('должен показывать стандартную ошибку, если нет описания', () => {
      const action = {
        type: createOrder.rejected.type
      };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.error).toBe('Не удалось оформить заказ');
    });
  });

  describe('getOrderByNumber', () => {
    test('должен включать загрузку при pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('должен сохранять заказ при успехе', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.currentOrder).toEqual(mockOrder);
    });

    test('должен сохранять ошибку при неудаче', () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        payload: mockErrorMessage
      };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(mockErrorMessage);
    });

    test('должен показывать стандартную ошибку, если нет описания', () => {
      const action = {
        type: getOrderByNumber.rejected.type
      };
      const newState = orderSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Не удалось получить заказ');
    });
  });

  describe('селекторы', () => {
    // Полное состояние приложения для тестов
    const fullState = {
      order: {
        orderRequest: true,
        orderModalData: mockOrder,
        currentOrder: mockOrder,
        loading: true,
        error: mockErrorMessage
      },
      feed: {
        orders: [mockOrder],
        total: 100,
        totalToday: 10,
        loading: false,
        error: null
      },
      orders: {
        orders: [],
        loading: false,
        error: null
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

    test('orderRequestSelector должен показывать статус создания', () => {
      const result = orderRequestSelector(fullState);
      expect(result).toBe(true);
    });

    test('orderModalDataSelector должен отдавать данные из модалки', () => {
      const result = orderModalDataSelector(fullState);
      expect(result).toEqual(mockOrder);
    });

    test('currentOrderSelector должен отдавать текущий заказ', () => {
      const result = currentOrderSelector(fullState);
      expect(result).toEqual(mockOrder);
    });

    test('orderLoadingSelector должен показывать статус загрузки', () => {
      const result = orderLoadingSelector(fullState);
      expect(result).toBe(true);
    });

    describe('orderByNumberSelector', () => {
      test('должен искать заказ в feed по номеру', () => {
        const selector = orderByNumberSelector(12345);
        const result = selector(fullState);
        expect(result).toEqual(mockOrder);
      });

      test('должен искать заказ в orders, если нет в feed', () => {
        const stateWithOrderInOrders = {
          ...fullState,
          feed: {
            ...fullState.feed,
            orders: []
          },
          orders: {
            orders: [mockOrder],
            loading: false,
            error: null
          }
        };

        const selector = orderByNumberSelector(12345);
        const result = selector(stateWithOrderInOrders);
        expect(result).toEqual(mockOrder);
      });

      test('должен возвращать null, если заказ не найден', () => {
        const selector = orderByNumberSelector(99999);
        const result = selector(fullState);
        expect(result).toBeNull();
      });

      test('должен возвращать null без номера', () => {
        const selector = orderByNumberSelector(undefined);
        const result = selector(fullState);
        expect(result).toBeNull();
      });
    });
  });
});
