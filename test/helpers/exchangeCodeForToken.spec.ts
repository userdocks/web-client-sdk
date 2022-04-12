import { config } from '../../src/config';
import { exchangeCodeForToken } from '../../src/helpers/exchangeCodeForToken';
import { token } from '../__fixtures__/token';

jest.mock('../../src/helpers/generateUuid');
jest.mock('../../src/helpers/getQueryParams');
jest.mock('../../src/helpers/getQueryParamsByName');

const orginalFetch = global.window.fetch;

beforeAll(() => {
  global.window.fetch = jest.fn().mockReturnValue(
    new Promise(resolve => {
      resolve({
        json: () =>
          new Promise(res => {
            res(token);
          }),
      });
    })
  );
});

afterAll(() => {
  global.window.fetch = orginalFetch;
});

describe('exchangeCodeForToken', () => {
  test('with default config should return a token object', async () => {
    const data = await exchangeCodeForToken(config);

    expect(data).toEqual(token);
  });

  test('with empty config sould use default config and should return a token object', async () => {
    const data = await exchangeCodeForToken({
      authServer: {},
      app: {},
    });

    expect(data).toEqual(token);
  });
});
