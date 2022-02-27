import { IMessagePayload } from '../types';
import { defaultToken } from './defaultToken';

export const message = (type = 'none', payload?: IMessagePayload) =>
  JSON.stringify({
    request: {
      type,
    },
    payload: payload?.payload || defaultToken,
  });
