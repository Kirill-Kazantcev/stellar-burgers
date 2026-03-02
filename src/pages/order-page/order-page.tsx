import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  currentOrderSelector,
  getOrderByNumber,
  ingredientsSelector,
  orderByNumberSelector,
  orderLoadingSelector
} from '../../services/slices';
import styles from './order-page.module.css';

export const OrderPage: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);
  const currentOrder = useSelector(currentOrderSelector);
  const routeOrder = useSelector(orderByNumberSelector(orderNumber));
  const orderData = routeOrder || currentOrder;
  const ingredients: TIngredient[] = useSelector(ingredientsSelector);
  const isLoading = useSelector(orderLoadingSelector);

  useEffect(() => {
    if (Number.isNaN(orderNumber) || routeOrder) {
      return;
    }
    dispatch(getOrderByNumber(orderNumber));
  }, [dispatch, orderNumber, routeOrder]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Показываем загрузку, пока идёт запрос или пока не загружены ингредиенты
  // (нужны для отображения состава заказа)
  if (isLoading || ingredients.length === 0) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return (
      <div className={styles.container}>
        <p className='text text_type_main-medium text_color_inactive'>
          Заказ не найден
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
