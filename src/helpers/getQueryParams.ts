import { generateUuid } from './generateUuid';
import { getQueryParamsByName } from './getQueryParamsByName';

export const getQueryParams = (grantType = 'authorization_code') => {
  const code = getQueryParamsByName('code') || '';
  const state = getQueryParamsByName('state') || generateUuid();
  const nonce = getQueryParamsByName('nonce') || generateUuid();
  const service = getQueryParamsByName('service') || '';
  const clientId = getQueryParamsByName('client_id') || '';
  const session = getQueryParamsByName('session') || '1';
  const keepMeLoggedIn = getQueryParamsByName('keepMeLoggedIn') || '';
  const redirectUri = decodeURIComponent(
    getQueryParamsByName('redirect_uri') || ''
  );
  const scope = decodeURIComponent(getQueryParamsByName('scope') || '');
  const authTime = Math.round(new Date().getTime() / 1000).toString();

  return {
    code,
    state,
    nonce,
    service,
    clientId,
    redirectUri,
    scope,
    authTime,
    grantType,
    session,
    keepMeLoggedIn,
  };
};
