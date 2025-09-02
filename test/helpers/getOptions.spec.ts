import { getOptions } from '../../src/helpers/getOptions';

describe('getOptions', () => {
  test('with default config should return config objects', async () => {
    const data = await getOptions({});

    expect(data).toEqual({
      audience: 'f0af4569-4d5d-4c20-af95-5a80c74e30a6',
      baseUri: 'https://api.userdocks.com',
      domain: 'userdocks.com',
      issuer: 'f0af4569-4d5d-4c20-af95-5a80c74e30a6',
      loginUri: 'https://login.userdocks.com',
      paymentUri: 'https://payment.userdocks.com',
      redirectUri: 'https://app.userdocks.com',
      refreshType: 'refresh',
      sdkUri: 'https://sdk.userdocks.com',
    });
  });
  test('with custom options should return custom objects', async () => {
    const data = await getOptions({
      app: {
        clientId: '1',
        origin: 'origin',
        refreshType: 'silentRefresh',
        redirectUri: 'redirectUri',
      },
      authServer: {
        apiUri: 'apiUri',
        domain: 'domain',
        loginUri: 'loginUri',
        paymentUri: 'paymentUri',
        sdkUri: 'sdkUri',
        paths: {
          exchangeCodeForToken: '/exchange',
          refresh: '/refresh',
        },
      },
    });

    expect(data).toEqual({
      audience: '1',
      baseUri: 'apiUri',
      domain: 'domain',
      issuer: 'f0af4569-4d5d-4c20-af95-5a80c74e30a6',
      loginUri: 'loginUri',
      paymentUri: 'paymentUri',
      redirectUri: 'redirectUri',
      refreshType: 'silentRefresh',
      sdkUri: 'sdkUri',
    });
  });
});
