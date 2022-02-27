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
};

export const token: IToken = {
  tokenType: 'Bearer',
  expiresIn: 1,
  redirectUri: 'http://localhost/',
  accessToken: accessToken,
  idToken: idToken,
};

export const wrongAudienceToken: IToken = {
  tokenType: 'Bearer',
  expiresIn: 1,
  redirectUri: 'http://localhost/',
  accessToken: accessToken,
  idToken: idTokenWrongAudience,
};

export const wrongIssuerToken: IToken = {
  tokenType: 'Bearer',
  expiresIn: 1,
  redirectUri: 'http://localhost/',
  accessToken: accessToken,
  idToken: idTokenWrongIssuer,
};

export const wrongNonceToken: IToken = {
  tokenType: 'Bearer',
  expiresIn: 1,
  redirectUri: 'http://localhost/',
  accessToken: accessToken,
  idToken: idTokenWrongNonce,
};
