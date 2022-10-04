import { IToken } from '../../src/types';
import {
  accessToken,
  idToken,
  idTokenWrongAudience,
  idTokenWrongIssuer,
  idTokenWrongNonce,
} from './jwt';

export const emptyToken: IToken = {
  tokenType: null,
  expiresIn: 0,
  redirectUri: null,
  accessToken: null,
  idToken: null,
  refreshToken: null,
};

export const token: IToken = {
  tokenType: 'Bearer',
  expiresIn: 1,
  redirectUri: 'http://localhost/',
  accessToken,
  idToken,
  refreshToken: 'xyz',
};

export const wrongAudienceToken: IToken = {
  tokenType: 'Bearer',
  expiresIn: 1,
  redirectUri: 'http://localhost/',
  accessToken,
  idToken: idTokenWrongAudience,
  refreshToken: 'xyz',
};

export const wrongIssuerToken: IToken = {
  tokenType: 'Bearer',
  expiresIn: 1,
  redirectUri: 'http://localhost/',
  accessToken,
  idToken: idTokenWrongIssuer,
  refreshToken: 'xyz',
};

export const wrongNonceToken: IToken = {
  tokenType: 'Bearer',
  expiresIn: 1,
  redirectUri: 'http://localhost/',
  accessToken,
  idToken: idTokenWrongNonce,
  refreshToken: 'xyz',
};
