import { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerErrorSelector, registerUser } from '../../services/slices';
import { useForm } from '../../hooks';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerError = useSelector(registerErrorSelector);
  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      registerUser({
        name: values.userName,
        email: values.email,
        password: values.password
      })
    ).then((result) => {
      if (registerUser.fulfilled.match(result)) {
        navigate('/', { replace: true });
      }
    });
  };

  return (
    <RegisterUI
      errorText={registerError || undefined}
      email={values.email}
      userName={values.userName}
      password={values.password}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
