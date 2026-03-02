import { ChangeEvent } from 'react';
import { PageUIProps } from '../common-type';

export type RegisterUIProps = PageUIProps & {
  password: string;
  userName: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
