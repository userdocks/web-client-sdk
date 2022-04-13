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
let options: IOptions;

const warn = () => {
  if (!version) {
    console.warn(
      // todo jpeer: add docs how to initialize userdocks web sdk
      'Userdocks: Make sure to initialize userdocks before you use the method'
    );
  }
};

const userdocks = {
  initialize: async (userdocksOptions?: IOptions) => {
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
  terminate() {
    worker?.terminate();
    tokenStoreWithoutWebWorker.terminate();
    version = null;
  },
  async exchangeCodeForToken() {
    warn();

    try {
      const token = await exchangeCodeForToken(options);

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
  redirectTo(redirectType: TRedirectType) {
    warn();

    return redirectTo(redirectType, options);
  },
  async logout() {
    warn();

    try {
      const logoutSuccess = await logout(options);

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

export default userdocks;
