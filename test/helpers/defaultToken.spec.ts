import { defaultToken } from '../../src/helpers/defaultToken';
import { emptyToken } from '../__fixtures__/token';

describe('defaultToken', () => {
  test('should be initialized with only null values', () =>
    expect(defaultToken).toEqual(emptyToken));
});
