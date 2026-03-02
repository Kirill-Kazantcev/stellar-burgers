import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { getErrorMessage } from '../utils';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
  loginError: string | null;
  registerError: string | null;
  updateUserError: string | null;
  forgotPasswordError: string | null;
  resetPasswordError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null,
  loginError: null,
  registerError: null,
  updateUserError: null,
  forgotPasswordError: null,
  resetPasswordError: null
};

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      if (!data?.success) {
        return rejectWithValue('Не удалось получить пользователя');
      }
      return data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const checkUserAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('user/checkUserAuth', async (_, { rejectWithValue }) => {
  if (!getCookie('accessToken')) {
    return null;
  }

  try {
    const data = await getUserApi();
    if (!data?.success) {
      return rejectWithValue('Не удалось проверить авторизацию');
    }
    return data.user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/loginUser', async (payload, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(payload);
    if (!data?.success) {
      return rejectWithValue('Не удалось авторизоваться');
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (payload, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(payload);
    if (!data?.success) {
      return rejectWithValue('Не удалось зарегистрироваться');
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', async (payload, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(payload);
    if (!data?.success) {
      return rejectWithValue('Не удалось обновить пользователя');
    }
    return data.user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const forgotPassword = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('user/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    await forgotPasswordApi({ email });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const resetPassword = createAsyncThunk<
  void,
  { password: string; token: string },
  { rejectValue: string }
>('user/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    await resetPasswordApi(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    userSelector: (state) => state.user,
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    userLoadingSelector: (state) => state.loading,
    loginErrorSelector: (state) => state.loginError,
    registerErrorSelector: (state) => state.registerError,
    updateUserErrorSelector: (state) => state.updateUserError,
    forgotPasswordErrorSelector: (state) => state.forgotPasswordError,
    resetPasswordErrorSelector: (state) => state.resetPasswordError
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Не удалось получить пользователя';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload || 'Не удалось авторизоваться';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registerError = action.payload || 'Не удалось зарегистрироваться';
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.updateUserError = action.payload || 'Не удалось обновить профиль';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Не удалось выйти из аккаунта';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.forgotPasswordError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.forgotPasswordError =
          action.payload || 'Не удалось отправить письмо';
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.resetPasswordError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.resetPasswordError =
          action.payload || 'Не удалось сменить пароль';
      });
  }
});

export const {
  isAuthCheckedSelector,
  forgotPasswordErrorSelector,
  loginErrorSelector,
  registerErrorSelector,
  resetPasswordErrorSelector,
  updateUserErrorSelector,
  userLoadingSelector,
  userSelector
} = userSlice.selectors;
