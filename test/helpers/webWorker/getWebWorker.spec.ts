import { getToken } from '../../../src/helpers/webWorker/getToken';

describe('getWebWorker', () => {
  it('should resolve the correct uuid', async () => {
    const worker = {
      onmessage: jest.fn(),
    };

    const tokenPromise = getToken(worker as any, 'myuuid');

    worker.onmessage({
      data: JSON.stringify({
        request: {
          type: 'getToken',
        },
        payload: {
          token: 'mytoken',
          uuid: 'myuuid',
        },
      }),
    });

    expect(await tokenPromise).toBe('mytoken');
  });

  it('should resolve when having two tokens at the same time', async () => {
    const worker = {
      onmessage: jest.fn(),
    };

    const tokenPromise = getToken(worker as any, 'myuuid');
    const secondTokenPromise = getToken(worker as any, 'anotheruuid');

    worker.onmessage({
      data: JSON.stringify({
        request: {
          type: 'getToken',
        },
        payload: {
          token: 'anothertoken',
          uuid: 'anotheruuid',
        },
      }),
    });

    expect(await secondTokenPromise).toBe('anothertoken');

    worker.onmessage({
      data: JSON.stringify({
        request: {
          type: 'getToken',
        },
        payload: {
          token: 'mytoken',
          uuid: 'myuuid',
        },
      }),
    });

    expect(await tokenPromise).toBe('mytoken');
  });
});
