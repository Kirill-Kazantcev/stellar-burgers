import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrders,
  ordersErrorSelector,
  ordersLoadingSelector,
  ordersSelector
} from '../../services/slices';

const PROFILE_ORDERS_POLL_INTERVAL_MS = 15000;

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(ordersSelector);
  const isLoading = useSelector(ordersLoadingSelector);
  const error = useSelector(ordersErrorSelector);

  useEffect(() => {
    dispatch(getOrders());

    const id = setInterval(() => {
      dispatch(getOrders());
    }, PROFILE_ORDERS_POLL_INTERVAL_MS);

    return () => {
      clearInterval(id);
    };
  }, [dispatch]);

  if (error && !orders.length) {
    return <p className='text text_type_main-default'>{error}</p>;
  }

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
