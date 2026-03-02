import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { ingredientByIdSelector } from '../../services/slices';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredientData = useSelector(ingredientByIdSelector(id));

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
