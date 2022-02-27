import { IToken } from '../../types';
import { getData } from './getData';
import { defaultToken } from '../defaultToken';
import { workerResolver } from '../../services/workerResolver';

/* istanbul ignore next */
export const getToken = async (
  worker: Worker | null,
  uuid: string
): Promise<IToken> => {
  if (!worker) {
    return defaultToken;
  }

  return new Promise(resolve => {
    // onmessage does run whenever new message comes in
    // and the original resolve does not exist in the context anymore
    // so we save the resolve into a global state to resuse it later
    workerResolver[uuid] = resolve;

    worker.onmessage = (e: MessageEvent) => {
      const data = getData(e);

      if (data?.request?.type !== 'getToken' || !('uuid' in data.payload)) {
        return;
      }

      // pop the latest resolve and resolve from this one
      // the getToken promise resolve does have a different pointer
      const prevResolve = workerResolver[data.payload.uuid];

      delete workerResolver[data.payload.uuid];

      return prevResolve(data.payload.token);
    };
  });
};
