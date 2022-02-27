import { IMessageData } from '../types';

export const defaultMessageData: IMessageData = {
  request: {
    type: null,
  },
  payload: {
    tokenType: null,
    expiresIn: null,
    redirectUri: null,
    accessToken: null,
    idToken: null,
  },
};
