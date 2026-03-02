export const API_URL =
  process.env.BURGER_API_URL || 'https://norma.education-services.ru/api';

// Исправляем: заменяем https:// на wss://, а не на ws://
const baseWsUrl = API_URL.replace('https://', 'wss://').replace('/api', '');

// URL для ленты заказов (все заказы)
export const WS_FEED_URL = `${baseWsUrl}/orders/all`;

// URL для истории заказов пользователя (требует токен)
export const WS_USER_ORDERS_URL = `${baseWsUrl}/orders`;

console.log('🔧 WebSocket URL:', WS_FEED_URL); // Должно быть wss://...

// Константы для экшенов WebSocket ленты заказов
export const WS_FEED_ACTIONS = {
  WS_CONNECTION_START: 'feed/wsConnectionStart',
  WS_CONNECTION_CLOSE: 'feed/wsConnectionClose',
  WS_CONNECTION_SUCCESS: 'feed/wsConnectionSuccess',
  WS_CONNECTION_ERROR: 'feed/wsConnectionError',
  WS_CONNECTION_CLOSED: 'feed/wsConnectionClosed',
  WS_GET_MESSAGE: 'feed/wsGetMessage'
} as const;

// Константы для экшенов WebSocket истории заказов пользователя
export const WS_USER_ORDERS_ACTIONS = {
  WS_CONNECTION_START: 'userOrders/wsConnectionStart',
  WS_CONNECTION_CLOSE: 'userOrders/wsConnectionClose',
  WS_CONNECTION_SUCCESS: 'userOrders/wsConnectionSuccess',
  WS_CONNECTION_ERROR: 'userOrders/wsConnectionError',
  WS_CONNECTION_CLOSED: 'userOrders/wsConnectionClosed',
  WS_GET_MESSAGE: 'userOrders/wsGetMessage'
} as const;
