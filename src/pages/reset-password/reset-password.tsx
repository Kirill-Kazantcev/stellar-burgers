import { FC, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  resetPassword,
  resetPasswordErrorSelector
} from '../../services/slices';
import { useForm } from '../../hooks';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorText = useSelector(resetPasswordErrorSelector);
  const { values, handleChange } = useForm({
    password: '',
    token: ''
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      resetPassword({ password: values.password, token: values.token })
    ).then((result) => {
      if (resetPassword.fulfilled.match(result)) {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      }
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={errorText || undefined}
      password={values.password}
      token={values.token}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
