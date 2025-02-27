import { getQueryParams } from './getQueryParams';
import { IIdTokenPayload, IOptions, IToken } from '../types';
import lang from './language';
import { jwtDecode } from './jwtDecode';
import { defaultToken } from './defaultToken';
import { getOptions } from './getOptions';
import { generateUuid } from './generateUuid';
import { getRefreshToken, setRefreshToken } from './getAndSetRefreshToken';
import { getClientIdForRequest } from './getClientIdForRequest';
import { getRequestUrl } from './getRequestUrl';

export type RequestType = 'exchangeCodeForToken' | 'refresh';

export const getTokenFromAPI = async (
  type: 'exchangeCodeForToken' | 'refresh',
  options: IOptions
) => {
  const { baseUri, domain, issuer, redirectUri: optionsRedirectUri } = getOptions(options);
  const queryParams = getQueryParams();
  const savedNonce = generateUuid();
  const url = getRequestUrl(type, baseUri, options);
  const language = lang();
  const {
    code,
    state,
    service,
    clientId,
    grantType,
    redirectUri,
    authTime,
    scope,
  } = queryParams;
  const cId = getClientIdForRequest(type, clientId, domain);
  const refreshToken = getRefreshToken(domain);

  if (type === 'refresh' && !refreshToken) {
    return defaultToken;
  }
  if (
    type === 'exchangeCodeForToken'
    && (!code || !service || !clientId)
  ) {
    return defaultToken;
  }

  try {
    const res = await fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        language,
        service: service || 'email',

        grant_type: grantType,
        client_id: cId,
        redirect_uri: redirectUri || optionsRedirectUri,
        code,
        state,
        nonce: savedNonce,
        auth_time: authTime,
        scope,
        ...(type === 'refresh' ? {
          prompt: 'none',
          refresh_token: refreshToken,
        } : {})
      }),
    });

    const data = await res.json();
    const dataAsToken: IToken = {
      accessToken: data?.accessToken || data?.items?.[0]?.accessToken,
      idToken: data?.idToken || data?.items?.[0]?.idToken,
      expiresIn: data?.expiresIn || data?.items?.[0]?.expiresIn,
      tokenType: data?.tokenType || data?.items?.[0]?.tokenType,
      redirectUri: data?.redirectUri || data?.items?.[0]?.redirectUri,
      refreshToken: data?.refreshToken  || data?.items?.[0]?.refreshToken,
    };

    const token = jwtDecode(dataAsToken?.idToken, 'id');
    const { iss, nonce, aud } = token.payload.id as IIdTokenPayload;
    let newRedirectUri = `${window.location.origin}${window.location.pathname}`;
    // ignore trailing slash
    newRedirectUri = newRedirectUri.endsWith('/') ? newRedirectUri.slice(0, -1) : `${newRedirectUri}`;

    const isNonce = savedNonce === nonce;
    const isIssuedBy = issuer === iss;
    const isRedirectUri = dataAsToken?.redirectUri === newRedirectUri;
    const isAudience = aud === cId;

    if (!isAudience || !isIssuedBy || !isNonce || (type === 'exchangeCodeForToken' &&  !isRedirectUri)) {
      return defaultToken;
    }

    setRefreshToken(domain, data?.refreshToken || data?.items?.[0]?.refreshToken);

    return dataAsToken;
  } catch (err) {
    return defaultToken;
  }
};
