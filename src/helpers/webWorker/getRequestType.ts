import { IMessageData, TRequestType } from '../../types';

export const getRequestType = (data?: IMessageData): TRequestType => {
  if (data && typeof data === 'object' && data?.hasOwnProperty('request')) {
    return data.request.type;
  }

  return null;
};
