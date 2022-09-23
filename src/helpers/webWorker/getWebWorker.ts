import { IOptions } from '../../types';
import { getOptions } from '../getOptions';

/* istanbul ignore next */
export const getWebWorker = async (options: IOptions) => {
  const { sdkUri } = getOptions(options);

  try {
    const res = await fetch(`${sdkUri}/identity-worker.js?v=1`);
    const data = await res.text();
    const workerSrcBlob = new Blob([data], {
      type: 'text/javascript',
    });

    const GlobalWorker = window.Worker;
    const workerBlobURL = window.URL.createObjectURL(workerSrcBlob);

    return new GlobalWorker(workerBlobURL);
  } catch (err) {
    console.warn(
      'A attempt to create a web worker failed. Make sure that the sdkUri in the config is correct.'
    );

    return null;
  }
};
