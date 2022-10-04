import { mocked } from 'ts-jest/utils';
import { config } from '../src/config';
import { defaultToken } from '../src/helpers/defaultToken';
import { getWebWorker } from '../src/helpers/webWorker/getWebWorker';
import userdocks from '../src/userdocks';

const postMessage = jest.fn();

jest.mock('../src/helpers/getTokenFromAPI');
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
  beforeEach(() => {
    mockedGetWebWorker.mockClear();
    postMessage.mockClear();
  });

  describe('without web worker', () => {
    beforeAll(async () => {
      (global as any).window = {};
      (global as any).window.Worker = undefined;
      userdocks.terminate();
      await userdocks.initialize(config);
    });

    test('echangeCodeForToken', async () => {
      const data = await userdocks.exchangeCodeForToken();

      expect(data).toBeTruthy();
    });

    test('getToken', async () => {
      const data = await userdocks.getToken();

      expect(data.accessToken).toBe(null);
      expect(data.idToken).toBe(null);
      expect(data.redirectUri).toBe(null);
      expect(data.tokenType).toBe(null);
      expect(typeof data.expiresIn).toBe('number');
    });

    test('redirectTo', async () => {
      const data = await userdocks.redirectTo({ type: 'signIn' });

      expect(data).toBeTruthy();
    });

    test('slientRefresh', async () => {
      const data = await userdocks.silentRefresh();

      expect(data).toBeFalsy();
    });

    test('logout', async () => {
      const data = await userdocks.logout();

      expect(data).toBeTruthy();
    });
  });

  describe('with webworker', () => {
    beforeAll(async () => {
      (global as any).window = {};
      (global as any).window.Worker = true;

      userdocks.terminate();
      await userdocks.initialize(config);
    });

    it('should get the correct postmessage on silentRefresh', async () => {
      await userdocks.silentRefresh();

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
    const data = await userdocks.exchangeCodeForToken();

    expect(data).toBeTruthy();
  });

  test('getToken', async () => {
    const data = await userdocks.getToken();

    expect(data.accessToken).toBe(null);
    expect(data.idToken).toBe(null);
    expect(data.redirectUri).toBe(null);
    expect(data.tokenType).toBe(null);
    expect(typeof data.expiresIn).toBe('number');
  });

  test('redirectTo', async () => {
    const data = await userdocks.redirectTo({ type: 'signIn' });

    expect(data).toBeTruthy();
  });

  test('logout', async () => {
    const data = await userdocks.logout();

    expect(data).toBeTruthy();
  });
});
