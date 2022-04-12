import { config } from '../../src/config';
import { exchangeCodeForToken } from '../../src/helpers/exchangeCodeForToken';
import * as redirect from '../../src/helpers/redirectTo';
import {
  emptyToken,
  token,
  wrongAudienceToken,
  wrongIssuerToken,
  wrongNonceToken,
} from '../__fixtures__/token';
import { queryParams } from '../__fixtures__/queryParams';
import { IToken } from '../../src/types';

jest.mock('../../src/helpers/redirectTo');
jest.mock('../../src/helpers/generateUuid');
jest.mock('../../src/helpers/getQueryParams', () => ({
  getQueryParams: jest
    .fn()
    .mockImplementationOnce(() => ({
      ...queryParams,
      clientId: '',
    }))
    .mockImplementationOnce(() => ({
      ...queryParams,
      service: '',
    }))
    .mockImplementationOnce(() => ({
      ...queryParams,
      code: '',
    }))
    .mockImplementation(() => ({
      ...queryParams,
    })),
}));
jest.mock('../../src/helpers/getQueryParamsByName');

const orginalFetch = global.window.fetch;

const fetchMock = (value: IToken) =>
  new Promise(resolve => {
    resolve({
      json: () =>
        new Promise(resolve =>
          resolve({
            ...value,
          })
        ),
    });
  });

beforeAll(() => {
  global.window.fetch = jest
    .fn()
    .mockReturnValueOnce(fetchMock(wrongAudienceToken))
    .mockReturnValueOnce(fetchMock(wrongIssuerToken))
    .mockReturnValueOnce(fetchMock(wrongNonceToken))
    .mockReturnValueOnce(new Promise((_, reject) => reject()));
});

afterAll(() => {
  global.window.fetch = orginalFetch;
});

describe('exchangeCodeForToken', () => {
  test('without a query parameter called "client_id" should return a empty token object and calls redirectTo', async () => {
    const data = await exchangeCodeForToken(config);
    const spy = jest.spyOn(redirect, 'redirectTo');

    expect(data).toEqual(emptyToken);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  test('without a query parameter called "service" should return a empty token object and calls redirectTo', async () => {
    const data = await exchangeCodeForToken(config);
    const spy = jest.spyOn(redirect, 'redirectTo');

    expect(data).toEqual(emptyToken);
    expect(spy).toHaveBeenCalledTimes(2);
  });
  test('without a query parameter called "code" should return a empty token object and calls redirectTo', async () => {
    const data = await exchangeCodeForToken(config);
    const spy = jest.spyOn(redirect, 'redirectTo');

    expect(data).toEqual(emptyToken);
    expect(spy).toHaveBeenCalledTimes(3);
  });
  test('with a wrong audience in the token should return a empty token object and calls redirectTo', async () => {
    const data = await exchangeCodeForToken(config);
    const spy = jest.spyOn(redirect, 'redirectTo');

    expect(data).toEqual(emptyToken);
    expect(spy).toHaveBeenCalledTimes(4);
  });
  test('with a wrong issuer in the token should return a empty token object and calls redirectTo', async () => {
    const data = await exchangeCodeForToken(config);
    const spy = jest.spyOn(redirect, 'redirectTo');

    expect(data).toEqual(emptyToken);
    expect(spy).toHaveBeenCalledTimes(5);
  });
  test('with a wrong nonce in the token should return a empty token object and calls redirectTo', async () => {
    const data = await exchangeCodeForToken(config);
    const spy = jest.spyOn(redirect, 'redirectTo');

    expect(data).toEqual(emptyToken);
    expect(spy).toHaveBeenCalledTimes(6);
  });
  test('with a rejected network request should return a default token', async () => {
    const data = await exchangeCodeForToken(config);
    const spy = jest.spyOn(redirect, 'redirectTo');

    expect(data).toEqual(emptyToken);
    expect(spy).toHaveBeenCalledTimes(6);
  });
});
