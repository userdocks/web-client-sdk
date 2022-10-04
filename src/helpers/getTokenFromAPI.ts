import { getQueryParams } from './getQueryParams';
import { IIdTokenPayload, IOptions, IToken } from '../types';
import lang from './language';
import { jwtDecode } from './jwtDecode';
import { defaultToken } from './defaultToken';
import { getOptions } from './getOptions';
import { redirectTo } from './redirectTo';
import { generateUuid } from './generateUuid';
import { getRefreshToken, Session, setRefreshToken } from './getAndSetRefreshToken';
import { getClientIdForRequest } from './getClientIdForRequest';
import { requestUrl } from './getRequestUrl';

export type RequestType = 'exchangeCodeForToken' | 'refresh';

export const getTokenFromAPI = async (
  type: 'exchangeCodeForToken' | 'refresh',
  options: IOptions
) => {
  const { baseUri, domain, issuer } = getOptions(options);
  const queryParams = getQueryParams();
  const savedNonce = generateUuid();
  const url = requestUrl(type, baseUri);
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
    session,
  } = queryParams;
  const cId = getClientIdForRequest(type, clientId, domain);
  const refreshToken = getRefreshToken(type, domain, session as Session);

  if (type === 'refresh' && !refreshToken) {
    return defaultToken;
  }
  if (
    type === 'exchangeCodeForToken'
    && (!code || !service || !clientId)
  ) {
    redirectTo(options, { type: 'unauthenticated' });

    return defaultToken;
  }

  try {
    const res = await fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify({
        language,
        service: service || 'email',

        grant_type: grantType,
        client_id: cId,
        redirect_uri: redirectUri,
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
      accessToken: data?.accessToken,
      idToken: data?.idToken,
      expiresIn: data?.expiresIn,
      tokenType: data?.tokenType,
      redirectUri: data?.redirectUri,
      refreshToken: data?.refreshToken,
    };

    const token = jwtDecode(dataAsToken?.idToken, 'id');
    const { iss, nonce, aud } = token.payload.id as IIdTokenPayload;
    const newRedirectUri = `${window.location.origin}${window.location.pathname}`;

    const isNonce = savedNonce === nonce;
    const isIssuedBy = issuer === iss;
    const isRedirectUri = dataAsToken?.redirectUri === newRedirectUri;
    const isAudience = aud === cId;

    if (!isAudience || !isIssuedBy || !isNonce) {
      redirectTo(options, { type: 'unauthenticated' });

      return defaultToken;
    } else if (type === 'exchangeCodeForToken' &&  !isRedirectUri) {
      redirectTo(options, { type: 'unauthenticated' });

      return defaultToken;
    }

    setRefreshToken(type, domain, session as Session, data?.refreshToken);

    return dataAsToken;
  } catch (err) {
    console.warn(
      'A request to fetch the tokens failed. Make sure that all properties of the config object are correct.'
    );

    return defaultToken;
  }
};
