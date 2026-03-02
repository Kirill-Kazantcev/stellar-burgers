import { ProfileUI } from '@ui-pages';
import { FC, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  updateUser,
  updateUserErrorSelector,
  userSelector
} from '../../services/slices';
import { useForm } from '../../hooks';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);
  const updateUserError = useSelector(updateUserErrorSelector);

  const { values, handleChange, setValues } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user, setValues]);

  const isFormChanged =
    values.name !== user?.name ||
    values.email !== user?.email ||
    !!values.password;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: values.name,
        email: values.email,
        ...(values.password ? { password: values.password } : {})
      })
    );
  };

  const handleCancel = () => {
    setValues({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  return (
    <ProfileUI
      formValue={values}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
    />
  );
};
