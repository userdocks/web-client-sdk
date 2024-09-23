import { IOptions } from "../types";

export const config: Required<IOptions> = {
  authServer: {
    domain: 'userdocks.com',
    apiUri: 'https://api.userdocks.com',
    loginUri: 'https://login.userdocks.com',
    paymentUri: 'https://payment.userdocks.com',
    sdkUri: 'https://sdk.userdocks.com',
    paths: {
      refresh: '/api/v1/tokens',
      exchangeCodeForToken: '/api/v1/tokens',
    },
  },
  app: {
    refreshType: 'refresh',
    origin: 'https://login.userdocks.com',
    clientId: 'f0af4569-4d5d-4c20-af95-5a80c74e30a6',
    redirectUri: 'https://app.userdocks.com',
  },
};
