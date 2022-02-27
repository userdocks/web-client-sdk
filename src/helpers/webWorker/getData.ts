import { defaultMessageData } from '../defaultMessageData';
import { IMessageData } from '../../types';

export const getData = (e: MessageEvent): IMessageData => {
  try {
    return JSON.parse(e.data);
  } catch {
    return defaultMessageData;
  }
};
