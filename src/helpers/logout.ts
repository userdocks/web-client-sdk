import { config } from '../config';
import { receiveMessage } from './receiveMessage';
import { ILogout, IOptions } from '../types';
import { getOptions } from './getOptions';

export const logout = (options: IOptions): Promise<ILogout> => {
  const {
    redirectUri,
    domain,
    loginUri,
    refreshType,
  } = getOptions(options);
  const clientId =
    localStorage.getItem(`${domain}:clientId`) ||
    options.app?.clientId ||
    config?.app?.clientId;
  const prompt = 'none';
  const url = `${loginUri}?redirect_uri=${encodeURIComponent(
    redirectUri
  )}&client_id=${clientId}&prompt=${prompt}&logout=true`;

  localStorage.clear();
  sessionStorage.clear();

  if (refreshType === 'refresh') {
    return new Promise(resolve => {
      resolve({
        success: true,
        loginUri: url,
      });
    });
  }

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  return new Promise(resolve => {
    window.addEventListener(
      'message',
      e => receiveMessage(e, iframe, options, resolve),
      false
    );
  });
};
