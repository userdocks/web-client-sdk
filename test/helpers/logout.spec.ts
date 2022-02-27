import { config } from '../../src/config';
import { logout } from '../../src/helpers/logout';

describe('logout', () => {
  test('with options ', () => {
    const originalEventListener = window.addEventListener;
    global.window.addEventListener = jest.fn();

    logout(config);

    expect(window.addEventListener).toBeCalledTimes(1);

    global.window.addEventListener = originalEventListener;
  });
  test('empty options ', () => {
    const originalEventListener = window.addEventListener;
    global.window.addEventListener = jest.fn();

    logout({
      authServer: {},
      app: {},
    });

    expect(window.addEventListener).toBeCalledTimes(1);

    global.window.addEventListener = originalEventListener;
  });
});
