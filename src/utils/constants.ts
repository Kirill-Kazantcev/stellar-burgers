export const API_URL =
  process.env.BURGER_API_URL || 'https://norma.education-services.ru/api';

const baseWsUrl = API_URL.replace('https://', 'wss://').replace('/api', '');

export const WS_FEED_URL = `${baseWsUrl}/orders/all`;

export const WS_USER_ORDERS_URL = `${baseWsUrl}/orders`;

export const WS_FEED_ACTIONS = {
  WS_CONNECTION_START: 'feed/wsConnectionStart',
  WS_CONNECTION_CLOSE: 'feed/wsConnectionClose',
  WS_CONNECTION_SUCCESS: 'feed/wsConnectionSuccess',
  WS_CONNECTION_ERROR: 'feed/wsConnectionError',
  WS_CONNECTION_CLOSED: 'feed/wsConnectionClosed',
  WS_GET_MESSAGE: 'feed/wsGetMessage'
} as const;

export const WS_USER_ORDERS_ACTIONS = {
  WS_CONNECTION_START: 'userOrders/wsConnectionStart',
  WS_CONNECTION_CLOSE: 'userOrders/wsConnectionClose',
  WS_CONNECTION_SUCCESS: 'userOrders/wsConnectionSuccess',
  WS_CONNECTION_ERROR: 'userOrders/wsConnectionError',
  WS_CONNECTION_CLOSED: 'userOrders/wsConnectionClosed',
  WS_GET_MESSAGE: 'userOrders/wsGetMessage'
} as const;
