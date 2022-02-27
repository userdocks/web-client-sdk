import { config } from '../config';
import { receiveMessage } from './receiveMessage';
import { ILogout, IOptions } from '../types';

export const logout = (options: IOptions): Promise<ILogout> => {
  const redirectUri = options?.app?.redirectUri || config.app.redirectUri;
  const domain = options?.authServer?.domain || config.authServer?.domain;
  const loginUri = options?.authServer?.loginUri || config.authServer?.loginUri;
  const clientId =
    localStorage.getItem(`${domain}:clientId`) ||
    options.app.clientId ||
    config.app.clientId;
  const prompt = 'none';

  const iframe = document.createElement('iframe');
  iframe.src = `${loginUri}?&redirectUri=${encodeURIComponent(
    redirectUri
  )}&clientId=${clientId}&prompt=${prompt}&logout=true`;
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  return new Promise(resolve => {
    return window.addEventListener(
      'message',
      e => receiveMessage(e, iframe, options, resolve),
      false
    );
  });
};
