import {
  userSlice,
  checkUserAuth,
  getUser,
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  userSelector,
  isAuthCheckedSelector,
  userLoadingSelector,
  loginErrorSelector,
  registerErrorSelector,
  updateUserErrorSelector,
  forgotPasswordErrorSelector,
  resetPasswordErrorSelector
} from '../userSlice';
import { TUser } from '@utils-types';

// Подменяем API на тестовую версию
jest.mock('@api', () => ({
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn()
}));

// Подменяем функции работы с куки
jest.mock('../../../utils/cookie', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('userSlice', () => {
  // Начальное состояние
  const initialState = {
    user: null, // данные пользователя
    isAuthChecked: false, // проверена ли авторизация
    loading: false, // идет загрузка?
    error: null, // общая ошибка
    loginError: null, // ошибка входа
    registerError: null, // ошибка регистрации
    updateUserError: null, // ошибка обновления
    forgotPasswordError: null, // ошибка восстановления
    resetPasswordError: null // ошибка сброса пароля
  };

  // Тестовые данные
  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test User'
  };


  const mockErrorMessage = 'Ошибка авторизации';

  describe('checkUserAuth', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('должен включать загрузку при pending', () => {
      const action = { type: checkUserAuth.pending.type };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(true);
    });

    test('должен сохранять пользователя при успехе', () => {
      const action = {
        type: checkUserAuth.fulfilled.type,
        payload: mockUser
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.user).toEqual(mockUser);
    });

    test('должен отмечать проверку даже без пользователя', () => {
      const action = {
        type: checkUserAuth.rejected.type
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.user).toBeNull();
    });
  });

  describe('getUser', () => {
    test('должен сохранять пользователя при успехе', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthChecked).toBe(true);
    });

    test('должен сохранять ошибку при неудаче', () => {
      const action = {
        type: getUser.rejected.type,
        payload: mockErrorMessage
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(mockErrorMessage);
      expect(newState.isAuthChecked).toBe(true);
    });
  });

  describe('loginUser', () => {
    test('должен сохранять пользователя при успешном входе', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.loginError).toBeNull();
    });

    test('должен сохранять ошибку при неудачном входе', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: mockErrorMessage
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.loginError).toBe(mockErrorMessage);
    });

    test('должен показывать стандартную ошибку, если нет описания', () => {
      const action = {
        type: loginUser.rejected.type
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.loginError).toBe('Не удалось авторизоваться');
    });
  });

  describe('registerUser', () => {
    test('должен сохранять пользователя при успешной регистрации', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.registerError).toBeNull();
    });

    test('должен сохранять ошибку при неудачной регистрации', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: mockErrorMessage
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.registerError).toBe(mockErrorMessage);
    });
  });

  describe('updateUser', () => {
    test('должен обновлять данные пользователя', () => {
      const action = {
        type: updateUser.fulfilled.type,
        payload: { ...mockUser, name: 'Updated Name' }
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.user).toEqual({ ...mockUser, name: 'Updated Name' });
      expect(newState.updateUserError).toBeNull();
    });

    test('должен сохранять ошибку при неудачном обновлении', () => {
      const action = {
        type: updateUser.rejected.type,
        payload: mockErrorMessage
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.updateUserError).toBe(mockErrorMessage);
    });
  });

  describe('logoutUser', () => {
    test('должен очищать данные при выходе', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthChecked: true
      };

      const action = { type: logoutUser.fulfilled.type };
      const newState = userSlice.reducer(stateWithUser, action);

      expect(newState.loading).toBe(false);
      expect(newState.user).toBeNull();
      expect(newState.isAuthChecked).toBe(true);
    });

    test('должен сохранять ошибку при неудачном выходе', () => {
      const action = {
        type: logoutUser.rejected.type,
        payload: mockErrorMessage
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(mockErrorMessage);
    });
  });

  describe('forgotPassword', () => {
    test('должен обрабатывать успешный запрос восстановления', () => {
      const action = { type: forgotPassword.fulfilled.type };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.forgotPasswordError).toBeNull();
    });

    test('должен сохранять ошибку при неудаче', () => {
      const action = {
        type: forgotPassword.rejected.type,
        payload: mockErrorMessage
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.forgotPasswordError).toBe(mockErrorMessage);
    });
  });

  describe('resetPassword', () => {
    test('должен обрабатывать успешный сброс пароля', () => {
      const action = { type: resetPassword.fulfilled.type };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.resetPasswordError).toBeNull();
    });

    test('должен сохранять ошибку при неудаче', () => {
      const action = {
        type: resetPassword.rejected.type,
        payload: mockErrorMessage
      };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.resetPasswordError).toBe(mockErrorMessage);
    });
  });

  describe('селекторы', () => {
    const state = {
      user: {
        user: mockUser,
        isAuthChecked: true,
        loading: true,
        error: null,
        loginError: 'login error',
        registerError: 'register error',
        updateUserError: 'update error',
        forgotPasswordError: 'forgot error',
        resetPasswordError: 'reset error'
      }
    };

    test('userSelector должен отдавать пользователя', () => {
      const result = userSelector(state);
      expect(result).toEqual(mockUser);
    });

    test('isAuthCheckedSelector должен показывать статус проверки', () => {
      const result = isAuthCheckedSelector(state);
      expect(result).toBe(true);
    });

    test('userLoadingSelector должен показывать статус загрузки', () => {
      const result = userLoadingSelector(state);
      expect(result).toBe(true);
    });

    test('loginErrorSelector должен отдавать ошибку входа', () => {
      const result = loginErrorSelector(state);
      expect(result).toBe('login error');
    });

    test('registerErrorSelector должен отдавать ошибку регистрации', () => {
      const result = registerErrorSelector(state);
      expect(result).toBe('register error');
    });

    test('updateUserErrorSelector должен отдавать ошибку обновления', () => {
      const result = updateUserErrorSelector(state);
      expect(result).toBe('update error');
    });

    test('forgotPasswordErrorSelector должен отдавать ошибку восстановления', () => {
      const result = forgotPasswordErrorSelector(state);
      expect(result).toBe('forgot error');
    });

    test('resetPasswordErrorSelector должен отдавать ошибку сброса', () => {
      const result = resetPasswordErrorSelector(state);
      expect(result).toBe('reset error');
    });
  });
});
