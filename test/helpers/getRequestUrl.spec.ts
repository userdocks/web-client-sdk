import { getRequestUrl } from '../../src/helpers/getRequestUrl';

describe('getRequestUrl', () => {
  test('with default config and exchangeCodeForToken should return config path for exchangeCodeForToken', async () => {
    const data = await getRequestUrl('exchangeCodeForToken', 'https://api.userdocks.com', {});

    expect(data).toEqual('https://api.userdocks.com/v1/rest/pc/login/oauth/identity/token');
  });
  test('with default config and refresh should return config path for refresh', async () => {
    const data = await getRequestUrl('refresh', 'https://api.userdocks.com', {});

    expect(data).toEqual('https://api.userdocks.com/v1/rest/pc/refresh');
  });
  test('with custom config and exchangeCodeForToken should return custom path for exchangeCodeForToken', async () => {
    const data = await getRequestUrl('exchangeCodeForToken', 'https://api.userdocks.com', {
      authServer: {
        paths: {
          exchangeCodeForToken: '/exchange',
          refresh: '/refresh',
        },
      },
    });

    expect(data).toEqual('https://api.userdocks.com/exchange');
  });
  test('with custom config and refresh should return config path for refresh', async () => {
    const data = await getRequestUrl('refresh', 'https://api.userdocks.com', {
      authServer: {
        paths: {
          exchangeCodeForToken: '/exchange',
          refresh: '/refresh',
        },
      },
    });

    expect(data).toEqual('https://api.userdocks.com/refresh');
  });
});