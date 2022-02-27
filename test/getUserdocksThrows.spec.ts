import { config } from '../src/config';
import { getUserdocks } from '../src/getUserdocks';
import { TUserdocks } from '../src/types';

jest.mock('../src/helpers/logout', () => ({
  logout: async () => {
    throw new Error();
  },
}));
jest.mock('../src/helpers/silentRefresh', () => ({
  silentRefresh: async () => {
    throw new Error();
  },
}));

describe('Userdocks', () => {
  let identity: TUserdocks;

  describe('without web worker', () => {
    beforeAll(async () => {
      (global as any).window = {};
      (global as any).window.Worker = undefined;

      identity?.terminate();
      identity = await getUserdocks(config);
    });

    test('slientRefresh', async () => {
      const data = await identity.silentRefresh();

      expect(data).toBeFalsy();
    });
    test('logout', async () => {
      const data = await identity.logout();

      expect(data).toEqual({
        success: false,
        loginUri: '',
      });
    });
  });
});
