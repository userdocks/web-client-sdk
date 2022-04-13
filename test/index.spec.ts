import userdocks from '../src';
import { config } from '../src/config';

beforeAll(async () => {
  global.URL.createObjectURL = jest.fn();
  global.fetch = jest.fn().mockReturnValue(
    new Promise(res => {
      res({
        text: () =>
          new Promise(r => {
            r('TEXT');
          }),
      });
    })
  );
  global.Worker = jest.fn();
  await userdocks.initialize(config);
});

describe('USERDOCKS', () => {
  test('has exchangeCodeForToken', () => {
    expect(userdocks).toHaveProperty('exchangeCodeForToken');
  });

  test('has getToken', () => {
    expect(userdocks).toHaveProperty('getToken');
  });

  test('has silentRefresh', () => {
    expect(userdocks).toHaveProperty('silentRefresh');
  });

  test('has redirectTo', () => {
    expect(userdocks).toHaveProperty('redirectTo');
  });

  test('has logout', () => {
    expect(userdocks).toHaveProperty('logout');
  });
});
