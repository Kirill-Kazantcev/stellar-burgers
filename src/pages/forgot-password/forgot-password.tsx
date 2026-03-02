import { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  forgotPassword,
  forgotPasswordErrorSelector
} from '../../services/slices';
import { useForm } from '../../hooks';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorText = useSelector(forgotPasswordErrorSelector);
  const { values, handleChange } = useForm({
    email: ''
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(forgotPassword(values.email)).then((result) => {
      if (forgotPassword.fulfilled.match(result)) {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      }
    });
  };

  return (
    <ForgotPasswordUI
      errorText={errorText || undefined}
      email={values.email}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
