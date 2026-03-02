import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useSelector } from '../../services/store';
import {
  ingredientByIdSelector,
  ingredientsLoadingSelector,
  ingredientsErrorSelector,
  ingredientsSelector
} from '../../services/slices';
import styles from './ingredient-page.module.css';

export const IngredientPage: FC = () => {
  const { id } = useParams();
  const ingredientData = useSelector(ingredientByIdSelector(id));
  const isLoading = useSelector(ingredientsLoadingSelector);
  const error = useSelector(ingredientsErrorSelector);
  const ingredients = useSelector(ingredientsSelector);

  // Если ингредиенты ещё не загружены (пустой массив) и нет ошибки - показываем загрузку
  if (isLoading || (ingredients.length === 0 && !error)) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className='text text_type_main-medium text_color_error'>{error}</p>
      </div>
    );
  }

  if (!ingredientData) {
    return (
      <div className={styles.container}>
        <p className='text text_type_main-medium text_color_inactive'>
          Ингредиент не найден
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={`text text_type_main-large ${styles.title}`}>
        Детали ингредиента
      </h2>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
