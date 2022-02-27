import { defaultToken } from '../defaultToken';
import { IToken } from '../../types';
import { getTokenPayload } from './getTokenPayload';

export interface ITokenStoreWithoutWebWorker {
  token: IToken;
  expirationTime: number;
  terminate(): void;
  getToken(): IToken;
  setToken(token: IToken): boolean;
  deleteToken(): boolean;
}

export const getTokenStoreWithoutWebWorker: ITokenStoreWithoutWebWorker = {
  token: defaultToken,
  expirationTime: 0,
  terminate() {
    this.token = defaultToken;
    this.expirationTime = 0;
  },
  getToken() {
    const payload = getTokenPayload(this.token.idToken || '', 'id');
    this.expirationTime = Number(payload?.exp);

    return this.token;
  },
  setToken(token: IToken): boolean {
    const payload = getTokenPayload(token.idToken || '', 'id');
    this.expirationTime = Number(payload?.exp);
    this.token = token;
    this.token.expiresIn =
      (this.expirationTime || 0) - Math.floor(new Date().getTime() / 1000);

    return true;
  },
  deleteToken() {
    this.token = defaultToken;

    return true;
  },
};
