import { message } from '../../src/helpers/message';
import { emptyToken, token } from '../__fixtures__/token';

describe('message', () => {
  test('getToken', () => {
    const msg = message('getToken', { payload: token });

    expect(msg).toBe(
      JSON.stringify({
        request: {
          type: 'getToken',
        },
        payload: token,
      })
    );
  });
  test('setToken', () => {
    const msg = message('setToken', { payload: { isTokenSet: true } });

    expect(msg).toBe(
      JSON.stringify({
        request: {
          type: 'setToken',
        },
        payload: { isTokenSet: true },
      })
    );
  });
  test('setToken', () => {
    const msg = message();

    expect(msg).toBe(
      JSON.stringify({
        request: {
          type: 'none',
        },
        payload: emptyToken,
      })
    );
  });
});
