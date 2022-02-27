import { defaultMessageData } from '../../../src/helpers/defaultMessageData';
import { getRequestType } from '../../../src/helpers/webWorker/getRequestType';

describe('getRequestType', () => {
  test('no data should return null', () => {
    const requestType = getRequestType();

    expect(requestType).toEqual(null);
  });
  test('defaultMessageData should return null', () => {
    const requestType = getRequestType(defaultMessageData);

    expect(requestType).toEqual(null);
  });
  test('getToken should return getToken', () => {
    const requestType = getRequestType({
      ...defaultMessageData,
      request: {
        type: 'getToken',
      },
    });

    expect(requestType).toEqual('getToken');
  });
  test('setToken should return setToken', () => {
    const requestType = getRequestType({
      ...defaultMessageData,
      request: {
        type: 'setToken',
      },
    });

    expect(requestType).toEqual('setToken');
  });
  test('deleteToken should return deleteToken', () => {
    const requestType = getRequestType({
      ...defaultMessageData,
      request: {
        type: 'deleteToken',
      },
    });

    expect(requestType).toEqual('deleteToken');
  });
});
