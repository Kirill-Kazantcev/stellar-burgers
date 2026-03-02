import { ChangeEvent, useCallback, useState } from 'react';

type FormValues = Record<string, string>;

type UseFormReturn<T extends FormValues> = {
  values: T;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setValue: <K extends keyof T>(name: K, value: T[K]) => void;
  setValues: (values: Partial<T> | ((prevValues: T) => T)) => void;
  reset: () => void;
};

export const useForm = <T extends FormValues>(
  initialValues: T
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  }, []);

  const setValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  }, []);

  const setValuesHandler = useCallback(
    (newValues: Partial<T> | ((prevValues: T) => T)) => {
      if (typeof newValues === 'function') {
        setValues(newValues);
      } else {
        setValues((prevValues) => ({
          ...prevValues,
          ...newValues
        }));
      }
    },
    []
  );

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    handleChange,
    setValue,
    setValues: setValuesHandler,
    reset
  };
};
