import { getQueryParams } from '../../src/helpers/getQueryParams';
import { queryParams } from '../__fixtures__/queryParams';

jest.mock('../../src/helpers/generateUuid');
jest.mock('../../src/helpers/getQueryParamsByName', () => ({
  getQueryParamsByName: jest.fn().mockReturnValue(''),
}));

describe('getQueryParams', () => {
  test('get all params ', () => {
    const originalMath = window.Math;
    global.window.Math.round = jest.fn().mockReturnValue('0');

    const params = getQueryParams();

    expect(params).toEqual({
      ...queryParams,
      code: '',
      service: '',
      clientId: '',
      redirectUri: '',
      scope: '',
    });

    global.window.Math = originalMath;
  });
});
