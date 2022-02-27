import { defaultMessageData } from '../../../src/helpers/defaultMessageData';
import { getData } from '../../../src/helpers/webWorker/getData';
import { token } from '../../__fixtures__/token';

describe('getData', () => {
  test('no event should return defaultMessageData', () => {
    const data = getData({} as MessageEvent);

    expect(data).toEqual(defaultMessageData);
  });
  test('no event should return defaultMessageData', () => {
    const message = {
      request: {
        type: 'getToken',
      },
      payload: token,
    };
    const data = getData({
      data: JSON.stringify(message),
    } as MessageEvent);

    expect(data).toEqual(message);
  });
});
