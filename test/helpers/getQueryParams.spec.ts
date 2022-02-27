import { getQueryParams } from '../../src/helpers/getQueryParams';
import { queryParams } from '../__fixtures__/queryParams';

jest.mock('../../src/helpers/getQueryParamsByName');

describe('getQueryParams', () => {
  test('get all params ', () => {
    const originalMath = window.Math;
    global.window.Math.round = jest.fn().mockReturnValue('0');

    const params = getQueryParams();

    expect(params).toEqual(queryParams);

    global.window.Math = originalMath;
  });
});
