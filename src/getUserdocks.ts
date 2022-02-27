import { config } from './config';
import { defaultToken } from './helpers/defaultToken';
import { exchangeCodeForToken } from './helpers/exchangeCodeForToken';
import { logout } from './helpers/logout';
import { redirectTo } from './helpers/redirectTo';
import { silentRefresh } from './helpers/silentRefresh';
import { getTokenStoreWithoutWebWorker } from './helpers/storeWithoutWebWorker/getTokenStoreWithoutWebWorker';
import { IOptions, TRedirectType } from './types';
import { getToken } from './helpers/webWorker/getToken';
import { getWebWorker } from './helpers/webWorker/getWebWorker';
import { message } from './helpers/message';
import { generateUuid } from './helpers/generateUuid';

let tokenStoreWithoutWebWorker = getTokenStoreWithoutWebWorker;
let worker: Worker | null = null;
let version: string | null = null;

export const getUserdocks = async (options?: IOptions) => {
  if (!version) {
    version = generateUuid();

    if (typeof window.Worker !== 'undefined') {
      worker = await getWebWorker(options || config);
    }
  }

  return {
    terminate() {
      worker?.terminate();
      tokenStoreWithoutWebWorker.terminate();
      version = null;
    },
    async exchangeCodeForToken() {
      const token = await exchangeCodeForToken(options || config);

      if (!!worker) {
        worker.postMessage(message('setToken', { payload: token }));
      } else {
        tokenStoreWithoutWebWorker.setToken(token);
      }

      return true;
    },
    async getToken() {
      let token = defaultToken;

      if (!!worker) {
        const uuid = generateUuid();

        worker.postMessage(message('getToken', { payload: { uuid } }));

        token = await getToken(worker, uuid);
      } else {
        token = tokenStoreWithoutWebWorker.getToken();
      }

      return token;
    },
    async silentRefresh() {
      try {
        const data = await silentRefresh(options || config);

        if (!!worker) {
          worker.postMessage(
            message('setToken', { payload: data.token || defaultToken })
          );
        } else {
          tokenStoreWithoutWebWorker.setToken(data.token || defaultToken);
        }

        return data.success || false;
      } catch (err) {
        console.warn(
          'A silent refresh failed. Make sure that all properties of the config object are correct.'
        );

        return false;
      }
    },
    redirectTo(redirectType: TRedirectType) {
      return redirectTo(redirectType, options || config);
    },
    async logout() {
      try {
        const logoutSuccess = await logout(options || config);

        if (!!worker) {
          worker.postMessage(message('deleteToken'));
        } else {
          tokenStoreWithoutWebWorker.deleteToken();
        }

        return logoutSuccess;
      } catch (err) {
        return {
          success: false,
          loginUri: '',
        };
      }
    },
  };
};
