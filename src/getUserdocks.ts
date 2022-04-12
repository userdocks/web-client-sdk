import { config } from './config';
import { defaultToken } from './helpers/defaultToken';
import { exchangeCodeForToken } from './helpers/exchangeCodeForToken';
import { logout } from './helpers/logout';
import { redirectTo } from './helpers/redirectTo';
import { silentRefresh } from './helpers/silentRefresh';
import { getTokenStoreWithoutWebWorker } from './helpers/storeWithoutWebWorker/getTokenStoreWithoutWebWorker';
import { IOptions, IToken, TRedirectType } from './types';
import { getToken } from './helpers/webWorker/getToken';
import { getWebWorker } from './helpers/webWorker/getWebWorker';
import { message } from './helpers/message';
import { generateUuid } from './helpers/generateUuid';

const tokenStoreWithoutWebWorker = getTokenStoreWithoutWebWorker;
let worker: Worker | null = null;
let version: string | null = null;
let globalPromise: Promise<Boolean>;
let renewPromise = true;

export const getUserdocks = async (options?: IOptions) => {
  if (!version) {
    version = generateUuid();

    if (typeof window !== 'undefined' && typeof window.Worker !== 'undefined') {
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
      try {
        const token = await exchangeCodeForToken(options || config);

        if (worker) {
          worker.postMessage(message('setToken', { payload: token }));
        } else {
          tokenStoreWithoutWebWorker.setToken(token);
        }

        return true;
      } catch (err) {
        console.error(
          'A request to echange a code for a token failed. Make sure that all properties of the config object are correct.'
        );
      }
      return false;
    },
    async getToken({ refresh }: { refresh?: boolean } = {}): Promise<IToken> {
      let token = defaultToken;

      if (worker) {
        const uuid = generateUuid();

        worker.postMessage(message('getToken', { payload: { uuid } }));

        token = await getToken(worker, uuid);
      } else {
        token = tokenStoreWithoutWebWorker.getToken();
      }

      if (refresh && token.expiresIn != null && token.expiresIn <= 0) {
        if (renewPromise) {
          renewPromise = false;

          globalPromise = new Promise(resolve => {
            this.silentRefresh()
              .then(resolve)
              .catch(() => {
                renewPromise = true;
                resolve(false);
              });
          });
        }

        const result = await globalPromise;

        renewPromise = true;

        if (result) {
          return this.getToken();
        }
      }

      return token;
    },
    async silentRefresh() {
      try {
        const data = await silentRefresh(options || config);

        if (!data) {
          return false;
        }

        if (worker) {
          worker.postMessage(
            message('setToken', { payload: data.token || defaultToken })
          );
        } else {
          tokenStoreWithoutWebWorker.setToken(data.token || defaultToken);
        }

        return data.success || false;
      } catch (err) {
        console.error(
          'A request for a silent refresh failed. Make sure that all properties of the config object are correct.'
        );
      }
      return false;
    },
    redirectTo(redirectType: TRedirectType) {
      return redirectTo(redirectType, options || config);
    },
    async logout() {
      try {
        const logoutSuccess = await logout(options || config);

        if (worker) {
          worker.postMessage(message('deleteToken'));
        } else {
          tokenStoreWithoutWebWorker.deleteToken();
        }

        return logoutSuccess;
      } catch (err) {
        console.error(
          'A request for a logout failed. Make sure that all properties of the config object are correct.'
        );
      }
      return {
        success: false,
        loginUri: '',
      };
    },
  };
};
