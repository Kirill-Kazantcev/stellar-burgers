import { FC } from 'react';
import { ConstructorPageUI } from '@ui-pages';
import { useSelector } from '../../services/store';
import { ingredientsLoadingSelector } from '../../services/slices';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(ingredientsLoadingSelector);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
