import { defaultSilentRefreshData } from './defaultSilentRefreshData';
import { generateUuid } from './generateUuid';
import { IOptions, IToken } from '../types';
import { defaultToken } from './defaultToken';
import { getOptions } from './getOptions';

export const receiveMessage = (
  event: MessageEvent,
  iframe: HTMLIFrameElement,
  options: IOptions,
  resolve: any
) => {
  const { loginUri, audience, redirectUri } = getOptions(options);
  const state = generateUuid();
  let data = defaultSilentRefreshData;
  let token: IToken | null = defaultToken;
  let isAllowed = false;

  if (typeof event?.data === 'string') {
    data = JSON.parse(event?.data || '{}');

    if (data && data?.originator === 'userdocks') {
      token = data?.token;
      isAllowed =
        (token && token.expiresIn && token.expiresIn >= 0) ||
        data.isAllowed ||
        isAllowed;
      data = {
        originator: data.originator,
        success: isAllowed,
        loginUri: `${loginUri}?client_id=${audience}&state=${state}&type=signIn&redirect_uri=${redirectUri}`,
        token,
      };

      window.removeEventListener('message', e =>
        receiveMessage(e, iframe, options, resolve)
      );
      iframe.parentNode?.removeChild(iframe);

      return resolve(data);
    }
  }

  return undefined;
};
