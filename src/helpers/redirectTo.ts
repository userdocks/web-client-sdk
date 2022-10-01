import { generateUuid } from './generateUuid';
import { getOptions } from './getOptions';
import { IOptions, IRedirectOptions } from '../types';

export const redirectTo = (options: IOptions, redirectOptions: IRedirectOptions) => {
  const  { type, payment } = redirectOptions;
  const state = generateUuid();
  const nonce = generateUuid();
  const { redirectUri, loginUri, paymentUri, audience, domain } = getOptions(options);
  const uri = type === 'payment' ? paymentUri : loginUri;
  const queryParameter = type === 'payment'
    ? `client_id=${audience}&state=${payment?.state}&type=${type}&session_id=${payment?.sessionId}&hash=${payment?.hash}`
    : `client_id=${audience}&state=${state}&type=${type}&redirect_uri=${redirectUri}`;

  localStorage.setItem(`${domain}:${audience}:state`, state);
  localStorage.setItem(`${domain}:${audience}:type`, type);
  localStorage.setItem(`${domain}:clientId`, audience);
  localStorage.setItem(`${domain}:${audience}:nonce`, nonce);

  const url = `${uri}?${queryParameter}`;

  window.location.href = url;

  return url;
};
