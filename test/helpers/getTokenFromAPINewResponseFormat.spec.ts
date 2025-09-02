import { config } from '../../src/config';
import { getTokenFromAPI } from '../../src/helpers/getTokenFromAPI';
import { token } from '../__fixtures__/token';

jest.mock('../../src/helpers/generateUuid');
jest.mock('../../src/helpers/getQueryParams');
jest.mock('../../src/helpers/getQueryParamsByName');
jest.mock('../../src/helpers/redirectTo');

const orginalFetch = global.window.fetch;

beforeAll(() => {
  sessionStorage.setItem('refreshToken', '1');
  global.window.fetch = jest.fn().mockReturnValue(
    new Promise(resolve => {
      resolve({
        status: 201,
        json: () =>
          new Promise(res => {
            res({
              items: [token],
            });
          }),
      });
    })
  );
});

afterAll(() => {
  global.window.fetch = orginalFetch;
  sessionStorage.clear();
});

describe('exchangeCodeForToken', () => {
  test('with default config should return a token object', async () => {
    const data = await getTokenFromAPI('exchangeCodeForToken', config);

    expect(data).toEqual(token);
  });

  test('with empty config sould use default config and should return a token object', async () => {
    const data = await getTokenFromAPI('exchangeCodeForToken', {
      authServer: {},
      app: {
        clientId: '',
        origin: '',
        redirectUri: '',
      },
    });

    expect(data).toEqual(token);
  });
});

describe('refresh', () => {
  test('with default config should return a token object', async () => {
    const data = await getTokenFromAPI('refresh', config);

    expect(data).toEqual(token);
  });

  test('with empty config sould use default config and should return a token object', async () => {
    const data = await getTokenFromAPI('refresh', {
      authServer: {},
      app: {
        clientId: '',
        origin: '',
        redirectUri: '',
      },
    });

    expect(data).toEqual(token);
  });
});
