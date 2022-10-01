import { getQueryParams } from './getQueryParams';
import { IIdTokenPayload, IOptions, IToken } from '../types';
import lang from './language';
import { jwtDecode } from './jwtDecode';
import { defaultToken } from './defaultToken';
import { getOptions } from './getOptions';
import { redirectTo } from './redirectTo';
import { generateUuid } from './generateUuid';

export const exchangeCodeForToken = async (options: IOptions) => {
  const { baseUri, domain, issuer } = getOptions(options);
  const queryParams = getQueryParams();
  const savedNonce = generateUuid();
  const URL = `${baseUri.replace(
    /\/$/,
    ''
  )}/rest/pc/login/oauth/identity/token`;
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

  localStorage.setItem(`${domain}:clientId`, clientId);

  if (!code || !service || !clientId) {
    redirectTo(options, { type: 'signUp' });

    return defaultToken;
  }
  try {
    const res = await fetch(URL, {
      method: 'post',
      headers: {
        Accept: 'application/json; charset=utf-8',
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      body: JSON.stringify({
        language,
        service,

        grant_type: grantType,
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
        state,
        nonce: savedNonce,
        auth_time: authTime,
        scope,
      }),
    });

    const data = await res.json();
    const dataAsToken: IToken = {
      accessToken: data?.accessToken,
      idToken: data?.idToken,
      expiresIn: data?.expiresIn,
      tokenType: data?.tokenType,
      redirectUri: data?.redirectUri,
    };

    const token = jwtDecode(dataAsToken?.idToken, 'id');
    const { iss, nonce, aud } = token.payload.id as IIdTokenPayload;
    const newRedirectUri = `${window.location.origin}${window.location.pathname}`;
    const isNonce = savedNonce === nonce;
    const isIssuedBy = issuer === iss;

    const isRedirectUri = dataAsToken?.redirectUri === newRedirectUri;
    const isAudience = aud === clientId;

    if (!isAudience || !isIssuedBy || !isNonce || !isRedirectUri) {
      redirectTo(options, { type: 'signUp' });

      return defaultToken;
    }

    return dataAsToken;
  } catch (err) {
    console.warn(
      'A request to fetch the tokens failed. Make sure that all properties of the config object are correct.'
    );

    return defaultToken;
  }
};
