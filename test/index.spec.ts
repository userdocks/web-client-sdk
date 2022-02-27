import userdocks from '../src';
import { config } from '../src/config';
import { TUserdocks } from '../src/types';

let identity: TUserdocks;

beforeAll(async () => {
  global.URL.createObjectURL = jest.fn();
  global.fetch = jest.fn().mockReturnValue(
    new Promise(res =>
      res({
        text: () => new Promise(res => res('TEXT')),
      })
    )
  );
  global.Worker = jest.fn();
  identity = await userdocks(config);
});

describe('USERDOCKS', () => {
  test('has exchangeCodeForToken', () => {
    const hasExchangeCodeForToken = identity.hasOwnProperty(
      'exchangeCodeForToken'
    );

    expect(hasExchangeCodeForToken).toBeTruthy();
  });
  test('has getToken', () => {
    const hasGetToken = identity.hasOwnProperty('getToken');

    expect(hasGetToken).toBeTruthy();
  });
  test('has silentRefresh', () => {
    const hasSilentRefresh = identity.hasOwnProperty('silentRefresh');

    expect(hasSilentRefresh).toBeTruthy();
  });
  test('has redirectTo', () => {
    const hasRedirectTo = identity.hasOwnProperty('redirectTo');

    expect(hasRedirectTo).toBeTruthy();
  });
  test('has logout', () => {
    const hasLogout = identity.hasOwnProperty('logout');

    expect(hasLogout).toBeTruthy();
  });
});
