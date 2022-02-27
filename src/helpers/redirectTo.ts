import { generateUuid } from './generateUuid';
import { getOptions } from './getOptions';
import { IOptions, TRedirectType } from '../types';

export const redirectTo = (type: TRedirectType, options: IOptions) => {
  const state = generateUuid();
  const nonce = generateUuid();
  const { redirectUri, loginUri, audience, domain } = getOptions(options);

  localStorage.setItem(`${domain}:${audience}:state`, state);
  localStorage.setItem(`${domain}:${audience}:type`, 'signUp');
  localStorage.setItem(`${domain}:clientId`, audience);
  localStorage.setItem(`${domain}:${audience}:nonce`, nonce);
  const url = `${loginUri}?client_id=${audience}&state=${state}&type=${type}&redirect_uri=${redirectUri}`;

  return (window.location.href = url);
};
