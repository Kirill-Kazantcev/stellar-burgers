import { FormEvent } from 'react';

export type PageUIProps = {
  errorText: string | undefined;
  email: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};
