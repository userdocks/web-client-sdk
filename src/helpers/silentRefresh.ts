import { config } from '../config';
import { generateUuid } from './generateUuid';
import { getOptions } from './getOptions';
import { receiveMessage } from './receiveMessage';

import { IOptions, ISilentRefreshData } from '../types';

/* istanbul ignore next */
export const silentRefresh = async (
  options: IOptions
): Promise<ISilentRefreshData> => {
  const { redirectUri, loginUri, audience } = getOptions(options);

  const grantType = 'refreshToken';
  const state = generateUuid();
  const nonce = generateUuid();
  const authTime = Math.round(new Date().getTime() / 1000).toString();
  const scope = 'openid offline_access';
  const prompt = 'none';

  const iframe = document.createElement('iframe');
  iframe.src = `${loginUri}?grant_type=${grantType}&state=${state}&nonce=${nonce}&auth_time=${authTime}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&client_id=${audience}&scope=${scope}&prompt=${prompt}`;
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  return new Promise(resolve =>
    window.addEventListener(
      'message',
      e => receiveMessage(e, iframe, options || config, resolve),
      false
    )
  );
};
