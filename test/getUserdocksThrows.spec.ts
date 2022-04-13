import { config } from '../src/config';
import userdocks from '../src/userdocks';

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
  describe('without web worker', () => {
    beforeAll(async () => {
      (global as any).window = {};
      (global as any).window.Worker = undefined;

      userdocks.terminate();
      await userdocks.initialize(config);
    });

    test('slientRefresh', async () => {
      const data = await userdocks.silentRefresh();

      expect(data).toBeFalsy();
    });

    test('logout', async () => {
      const data = await userdocks.logout();

      expect(data).toEqual({
        success: false,
        loginUri: '',
      });
    });
  });
});
