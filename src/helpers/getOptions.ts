import { config } from '../config';
import { IOptions } from '../types';

export const getOptions = (options: IOptions) => {
  const domain = options?.authServer?.domain || config?.authServer?.domain || '';
  const redirectUri = options?.app?.redirectUri || config?.app?.redirectUri || '';
  const loginUri = options?.authServer?.loginUri || config.authServer?.loginUri || '';
  const paymentUri = options?.authServer?.paymentUri || config.authServer?.paymentUri || '';
  const sdkUri = options?.authServer?.sdkUri || config.authServer?.sdkUri || '';
  const issuer = config?.app?.clientId || '';
  const refreshType = options?.app?.refreshType || config?.app?.refreshType || '';

  const audience =
    options?.app?.clientId
    || localStorage.getItem(`${domain}:clientId`)
    || config?.app?.clientId
    || '';

  const baseUri = options?.authServer?.apiUri || config?.authServer?.apiUri || '';

  return {
    redirectUri,
    domain,
    loginUri,
    paymentUri,
    issuer,
    audience,
    baseUri,
    sdkUri,
    refreshType,
  };
};
