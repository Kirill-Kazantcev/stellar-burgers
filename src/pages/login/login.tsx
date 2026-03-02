import { FC, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginErrorSelector, loginUser } from '../../services/slices';
import { useForm } from '../../hooks';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loginError = useSelector(loginErrorSelector);
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      loginUser({ email: values.email, password: values.password })
    ).then((result) => {
      if (loginUser.fulfilled.match(result)) {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      }
    });
  };

  return (
    <LoginUI
      errorText={loginError || undefined}
      email={values.email}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
