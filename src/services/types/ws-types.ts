import { TOrder } from '@utils-types';

export type TWSOrder = TOrder;

export type TWSFeedResponse = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TWSActions = {
  wsInit: string;
  wsClose: string;
  onOpen: string;
  onError: string;
  onMessage: string;
  onClose?: string;
};
