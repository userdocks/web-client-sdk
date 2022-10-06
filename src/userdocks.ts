import { config } from './config';
import { defaultToken } from './helpers/defaultToken';
import { getTokenFromAPI } from './helpers/getTokenFromAPI';
import { logout } from './helpers/logout';
import { redirectTo } from './helpers/redirectTo';
import { silentRefresh } from './helpers/silentRefresh';
import { getTokenStoreWithoutWebWorker } from './helpers/storeWithoutWebWorker/getTokenStoreWithoutWebWorker';
import { IOptions, IRedirectOptions, IToken } from './types';
import { getToken } from './helpers/webWorker/getToken';
import { getWebWorker } from './helpers/webWorker/getWebWorker';
import { message } from './helpers/message';
import { generateUuid } from './helpers/generateUuid';
import { isLoggedIn } from './helpers/isLoggedIn';
import { generateRandomString } from './helpers/generateRandom';
import { getOptions } from './helpers/getOptions';

const tokenStoreWithoutWebWorker = getTokenStoreWithoutWebWorker;
let worker: Worker | null = null;
let version: string | null = null;
let globalPromise: Promise<Boolean>;
let renewPromise = true;
let options: IOptions;

const isInitialized = () => !!version

const warn = () => {
  if (isInitialized()) {
    console.warn(
      // todo jpeer: add docs how to initialize userdocks web sdk
      'Userdocks: Make sure to initialize userdocks before you use the method'
    );
  }
};


const userdocks = {
  initialize: async (userdocksOptions?: IOptions, ) => {
    options = userdocksOptions || config;

    if (version) {
      console.warn(
        'Userdocks: Please make sure you initialize userdocks SDK only once'
      );
    } else {
      version = generateUuid();

      if (
        typeof window !== 'undefined' &&
        typeof window.Worker !== 'undefined'
      ) {
        worker = await getWebWorker(options);
      }
    }
  },
  isInitialized,
  terminate() {
    worker?.terminate();
    tokenStoreWithoutWebWorker.terminate();
    version = null;
  },
  async exchangeCodeForToken() {
    warn();

    try {
      if (isLoggedIn(options)) {
        return true;
      }

      const token = await getTokenFromAPI('exchangeCodeForToken', options);

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
    warn();

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

        const { refreshType } = getOptions(options);

        const refreshFunc = refreshType === 'refresh'
          ? this.refresh
          : this.silentRefresh;

        globalPromise = new Promise(resolve => {
          refreshFunc()
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
  async refresh() {
    warn();

    try {
      const token = await getTokenFromAPI('refresh', options);

      if (worker) {
        worker.postMessage(message('setToken', { payload: token }));
      } else {
        tokenStoreWithoutWebWorker.setToken(token);
      }

      return true;
    } catch(err) {
      console.error(
        'A request for a refresh failed. Make sure that all properties of the config object are correct.'
      );
    }

    return false;
  },
  async silentRefresh() {
    warn();

    try {
      const data = await silentRefresh(options);

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
  redirectTo(redirectOptions: IRedirectOptions) {
    warn();

    return redirectTo(options, redirectOptions);
  },
  async logout() {
    warn();

    try {
      const logoutObj = await logout(options);

      if (worker) {
        worker.postMessage(message('deleteToken'));
      } else {
        tokenStoreWithoutWebWorker.deleteToken();
      }

      if (logoutObj.success) {
        return this.redirectTo({
          type: 'logout',
        });
      }
    } catch (err) {
      console.error(
        'A request for a logout failed. Make sure that all properties of the config object are correct.'
      );
    }

    return this.redirectTo({
      type: 'unauthenticated',
    });
  },
  generateState(length = 64) {
    return generateRandomString(length, true);
  },
};

export default userdocks;
