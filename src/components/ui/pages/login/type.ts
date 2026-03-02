import { ChangeEvent } from 'react';
import { PageUIProps } from '../common-type';

export type LoginUIProps = Omit<PageUIProps, 'setEmail'> & {
  password: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
