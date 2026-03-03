import { rootReducer } from '../rootReducer';
import { ingredientsSlice } from '../slices/ingredientsSlice';
import { constructorSlice } from '../slices/constructorSlice';
import { feedSlice } from '../slices/feedSlice';
import { orderSlice } from '../slices/orderSlice';
import { ordersSlice } from '../slices/ordersSlice';
import { userSlice } from '../slices/userSlice';
import feedSocketReducer from '../slices/feedSocketSlice';

describe('rootReducer', () => {
  test('должен возвращать корректное начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, unknownAction);

    const expectedState = {
      ingredients: ingredientsSlice.getInitialState(),
      burgerConstructor: constructorSlice.getInitialState(),
      order: orderSlice.getInitialState(),
      feed: feedSlice.getInitialState(),
      orders: ordersSlice.getInitialState(),
      user: userSlice.getInitialState(),
      feedSocket: feedSocketReducer(undefined, { type: '@@INIT' })
    };
    expect(state).toEqual(expectedState);
  });
});
