import { getTokenStoreWithoutWebWorker } from '../../../src/helpers/storeWithoutWebWorker/getTokenStoreWithoutWebWorker';
import { emptyToken, token as t } from '../../__fixtures__/token';

describe('Token Store without Web Worker', () => {
  test('holds default token', () => {
    const store = getTokenStoreWithoutWebWorker;

    expect(store.token.idToken).toEqual(emptyToken.idToken);
    expect(store.token.accessToken).toEqual(emptyToken.accessToken);
  });
  test('get default token', () => {
    const store = getTokenStoreWithoutWebWorker;

    const token = store.getToken();

    expect(token.idToken).toEqual(emptyToken.idToken);
    expect(token.accessToken).toEqual(emptyToken.accessToken);
  });
  test('set token', () => {
    const store = getTokenStoreWithoutWebWorker;

    store.setToken(t);
    const token = store.getToken();

    expect(token.idToken).toBe(t.idToken);
    expect(token.accessToken).toBe(t.accessToken);
  });
  test('set and delete token', () => {
    const store = getTokenStoreWithoutWebWorker;

    store.setToken(t);
    let token = store.getToken();

    expect(token.idToken).toBe(t.idToken);
    expect(token.accessToken).toBe(t.accessToken);

    store.deleteToken();
    token = store.getToken();

    expect(token.idToken).toBe(emptyToken.idToken);
    expect(token.accessToken).toBe(emptyToken.accessToken);
  });
});
