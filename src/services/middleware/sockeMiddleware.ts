import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface WSActions {
  wsInit: string;
  wsClose: string;
  onOpen: string;
  onError: string;
  onMessage: string;
  onClose?: string;
}

export const socketMiddleware = (
  wsUrl: string,
  wsActions: WSActions
): Middleware =>
  ((store: MiddlewareAPI<any, RootState>) => {
    let socket: WebSocket | null = null;
    let isConnected = false;
    let reconnectTimer: number = 0;
    let currentUrl = wsUrl;
    let isClosing = false;

    return (next) => (action: any) => {
      const { dispatch } = store;
      const { type, payload } = action;

      if (type === wsActions.wsInit) {
        if (
          socket &&
          (socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING)
        ) {
          return next(action);
        }

        currentUrl = payload ? `${wsUrl}${payload}` : wsUrl;
        socket = new WebSocket(currentUrl);
        isConnected = true;
        isClosing = false;
      }

      if (socket) {
        socket.onopen = () => {
          if (!isClosing) {
            dispatch({ type: wsActions.onOpen });
          }
        };

        socket.onerror = () => {
          if (!isClosing) {
            dispatch({
              type: wsActions.onError,
              payload: 'WebSocket connection error'
            });
          }
        };

        socket.onmessage = (event) => {
          if (!isClosing) {
            const { data } = event;
            try {
              const parsedData = JSON.parse(data);
              dispatch({ type: wsActions.onMessage, payload: parsedData });
            } catch (error) {
              console.error('Failed to parse WebSocket message:', error);
            }
          }
        };

        socket.onclose = () => {
          if (!isClosing && wsActions.onClose) {
            dispatch({ type: wsActions.onClose });
          }

          if (isConnected && !isClosing) {
            reconnectTimer = window.setTimeout(() => {
              if (!isClosing) {
                dispatch({
                  type: wsActions.wsInit,
                  payload: currentUrl.replace(wsUrl, '')
                });
              }
            }, 3000);
          }
        };

        if (type === wsActions.wsClose) {
          isClosing = true;
          isConnected = false;
          clearTimeout(reconnectTimer);

          if (socket) {
            socket.close();
            socket = null;
          }
        }
      }

      next(action);
    };
  }) as Middleware;
