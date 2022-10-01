import { config } from '../../src/config';
import { redirectTo } from '../../src/helpers/redirectTo';

jest.mock('../../src/helpers/generateUuid');
jest.mock('../../src/helpers/getQueryParams');
jest.mock('../../src/helpers/getQueryParamsByName');

describe('redirectTo', () => {
  test('successful signIn', async () => {
    // setup
    const originalWindow = window;
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
    });

    const data = await redirectTo(config, { type: 'signUp' });

    expect(data).toBe(
      'https://login.userdocks.com?client_id=f0af4569-4d5d-4c20-af95-5a80c74e30a6&state=30e9651e-3e4d-4a67-94bc-b35edb9924be&type=signUp&redirect_uri=https://app.userdocks.com'
    );

    // cleanup
    global.window = originalWindow;
  });

  test('successful signUp', async () => {
    // setup
    const originalWindow = window;
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
    });

    const data = await redirectTo({
      authServer: {},
      app: {
        clientId: '',
        origin: '',
        redirectUri: '',
      },
    }, { type: 'signIn' });

    expect(data).toBe(
      'https://login.userdocks.com?client_id=f0af4569-4d5d-4c20-af95-5a80c74e30a6&state=30e9651e-3e4d-4a67-94bc-b35edb9924be&type=signIn&redirect_uri=https://app.userdocks.com'
    );

    // cleanup
    global.window = originalWindow;
  });
  test('successful payment', async () => {
    // setup
    const originalWindow = window;
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
    });

    const data = await redirectTo({
      authServer: {},
      app: {
        clientId: '',
        origin: '',
        redirectUri: '',
      },
    }, {
      type: 'payment',
      payment: {
        sessionId: '1',
        state: '2',
        hash: '3',
      },
    });

    expect(data).toBe(
      'https://payment.userdocks.com?client_id=f0af4569-4d5d-4c20-af95-5a80c74e30a6&state=2&type=payment&session_id=1&hash=3'
    );

    // cleanup
    global.window = originalWindow;
  });
});
