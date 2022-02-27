import { config } from '../../src/config';
import { defaultToken } from '../../src/helpers/defaultToken';
import { receiveMessage } from '../../src/helpers/receiveMessage';
import { token } from '../__fixtures__/token';

jest.mock('../../src/helpers/generateUuid');

describe('receiveMessage', () => {
  test('successful', async () => {
    const originalEventListener = window.removeEventListener;
    const iframe = global.window.document.createElement('iframe');
    global.window.removeEventListener = jest.fn();

    const data = receiveMessage(
      {
        data: JSON.stringify({
          token,
        }),
      } as MessageEvent,
      iframe,
      config,
      // @ts-ignore
      val => val
    );

    expect(data).toEqual({
      success: true,
      loginUri:
        'https://login.userdocks.com?client_id=f0af4569-4d5d-4c20-af95-5a80c74e30a6&state=30e9651e-3e4d-4a67-94bc-b35edb9924be&type=signIn&redirect_uri=https://app.userdocks.com',
      token,
    });
    expect(global.window.removeEventListener).toBeCalledTimes(1);

    global.window.removeEventListener = originalEventListener;
  });
  test('unsuccessful', async () => {
    // setup
    const originalWindow = window;
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
    });
    Object.defineProperty(window, 'removeEventListener', {
      value: jest.fn(),
    });

    const iframe = global.window.document.createElement('iframe');

    const data = receiveMessage(
      {
        data: JSON.stringify({ token: defaultToken }),
      } as MessageEvent,
      iframe,
      config,
      // @ts-ignore
      val => val
    );

    // is actually setting the window.location.href to redirect instantly
    expect(data).toBe(
      'https://login.userdocks.com?client_id=f0af4569-4d5d-4c20-af95-5a80c74e30a6&state=30e9651e-3e4d-4a67-94bc-b35edb9924be&type=signIn&redirect_uri=https://app.userdocks.com'
    );
    expect(global.window.removeEventListener).toBeCalledTimes(0);

    // cleanup
    global.window = originalWindow;
  });
  test('unsuccessful', async () => {
    // setup
    const originalWindow = window;
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
    });
    Object.defineProperty(window, 'removeEventListener', {
      value: jest.fn(),
    });

    const iframe = global.window.document.createElement('iframe');

    // @ts-ignore
    const data = receiveMessage({} as MessageEvent, iframe, config, val => val);

    // is actually setting the window.location.href to redirect instantly
    expect(data).toBe('');
    expect(global.window.removeEventListener).toBeCalledTimes(0);

    // cleanup
    global.window = originalWindow;
  });
});
