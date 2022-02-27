import { mocked } from 'ts-jest/utils';
import { config } from '../src/config';
import { getUserdocks } from '../src/getUserdocks';
import { TUserdocks } from '../src/types';
import { getWebWorker } from '../src/helpers/webWorker/getWebWorker';
import { defaultToken } from '../src/helpers/defaultToken';

const postMessage = jest.fn();

jest.mock('../src/helpers/exchangeCodeForToken');
jest.mock('../src/helpers/logout');
jest.mock('../src/helpers/redirectTo');
jest.mock('../src/helpers/silentRefresh');
jest.mock('../src/helpers/webWorker/getToken');
jest.mock('../src/helpers/webWorker/getWebWorker', () => ({
  getWebWorker: jest.fn().mockImplementation(() => ({
    postMessage,
  })),
}));

const mockedGetWebWorker = mocked(getWebWorker);

describe('Userdocks', () => {
  let identity: TUserdocks;

  beforeEach(() => {
    mockedGetWebWorker.mockClear();
    postMessage.mockClear();
  });

  describe('without web worker', () => {
    beforeAll(async () => {
      (global as any).window = {};
      (global as any).window.Worker = undefined;

      identity?.terminate();
      identity = await getUserdocks(config);
    });

    test('echangeCodeForToken', async () => {
      const data = await identity.exchangeCodeForToken();

      expect(data).toBeTruthy();
    });
    test('getToken', async () => {
      const data = await identity.getToken();

      expect(data.accessToken).toBe(null);
      expect(data.idToken).toBe(null);
      expect(data.redirectUri).toBe(null);
      expect(data.tokenType).toBe(null);
      expect(typeof data.expiresIn).toBe('number');
    });
    test('redirectTo', async () => {
      const data = await identity.redirectTo('signIn');

      expect(data).toBeTruthy();
    });
    test('slientRefresh', async () => {
      const data = await identity.silentRefresh();

      expect(data).toBeFalsy();
    });
    test('logout', async () => {
      const data = await identity.logout();

      expect(data).toEqual({
        success: true,
        loginUri: 'http://localhost',
      });
    });
  });

  describe('with webworker', () => {
    beforeAll(async () => {
      (global as any).window = {};
      (global as any).window.Worker = true;

      identity?.terminate();
      identity = await getUserdocks(config);
    });

    it('should get the correct postmessage on silentRefresh', async () => {
      await identity.silentRefresh();

      expect(postMessage).toHaveBeenCalledTimes(1);
      expect(postMessage).toHaveBeenCalledWith(
        JSON.stringify({
          request: {
            type: 'setToken',
          },
          payload: defaultToken,
        })
      );
    });
  });

  test('echangeCodeForToken', async () => {
    const data = await identity.exchangeCodeForToken();

    expect(data).toBeTruthy();
  });
  test('getToken', async () => {
    const data = await identity.getToken();

    expect(data.accessToken).toBe(null);
    expect(data.idToken).toBe(null);
    expect(data.redirectUri).toBe(null);
    expect(data.tokenType).toBe(null);
    expect(typeof data.expiresIn).toBe('number');
  });
  test('redirectTo', async () => {
    const data = await identity.redirectTo('signIn');

    expect(data).toBeTruthy();
  });
  test('logout', async () => {
    const data = await identity.logout();

    expect(data).toEqual({
      success: true,
      loginUri: 'http://localhost',
    });
  });
});
