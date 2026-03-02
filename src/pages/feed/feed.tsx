import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  wsConnectionStart,
  wsConnectionClose
} from '../../services/slices/feedSocketSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const isConnectedRef = useRef(false);

  const orders = useSelector((state) => state.feedSocket?.orders || []);
  const isConnected = useSelector(
    (state) => state.feedSocket?.isConnected || false
  );
  const error = useSelector((state) => state.feedSocket?.error || null);

  useEffect(() => {
    if (!isConnectedRef.current) {
      dispatch(wsConnectionStart());
      isConnectedRef.current = true;
    }

    return () => {
      if (isConnectedRef.current) {
        dispatch(wsConnectionClose());
        isConnectedRef.current = false;
      }
    };
  }, [dispatch]);

  const handleGetFeeds = useCallback(() => {
    dispatch(wsConnectionClose());
    setTimeout(() => {
      dispatch(wsConnectionStart());
    }, 100);
  }, [dispatch]);

  if (error && !orders.length) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p className='text text_type_main-default text_color_error'>
          Ошибка: {error}
        </p>
        <button onClick={handleGetFeeds}>Попробовать снова</button>
      </div>
    );
  }

  if (!isConnected && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
