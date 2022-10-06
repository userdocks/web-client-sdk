import { config } from '../../src/config';
import { logout } from '../../src/helpers/logout';

describe('logout', () => {
  test('with options (refreshType: refresh)', () => {
    const originalEventListener = window.addEventListener;
    global.window.addEventListener = jest.fn();

    logout(config);

    expect(window.addEventListener).toBeCalledTimes(0);

    global.window.addEventListener = originalEventListener;
  });
  test('empty options (refreshType: refresh)', () => {
    const originalEventListener = window.addEventListener;
    global.window.addEventListener = jest.fn();

    logout({
      authServer: {},
      app: {
        clientId: '',
        origin: '',
        redirectUri: '',
      },
    });

    expect(window.addEventListener).toBeCalledTimes(0);

    global.window.addEventListener = originalEventListener;
  });
  test('with options (refreshType: silentRefresh)', () => {
    const originalEventListener = window.addEventListener;
    global.window.addEventListener = jest.fn();

    logout({
      ...config,
      app: {
        ...config.app,
        refreshType: 'silentRefresh',
      }
    });

    expect(window.addEventListener).toBeCalledTimes(1);

    global.window.addEventListener = originalEventListener;
  });
  test('empty options (refreshType: silentRefresh)', () => {
    const originalEventListener = window.addEventListener;
    global.window.addEventListener = jest.fn();

    logout({
      authServer: {},
      app: {
        refreshType: 'silentRefresh',
        clientId: '',
        origin: '',
        redirectUri: '',
      },
    });

    expect(window.addEventListener).toBeCalledTimes(1);

    global.window.addEventListener = originalEventListener;
  });
});
