import { getQueryParamsByName } from '../../src/helpers/getQueryParamsByName';

describe('getQueryParams', () => {
  test('get all params ', () => {
    const param = getQueryParamsByName('test', 'http://localhost?test=1234');

    expect(param).toBe('1234');
  });
  test('get all params ', () => {
    const param = getQueryParamsByName('test', 'http://localhost');

    expect(param).toBe('');
  });
  test('get all params via window.location', () => {
    const originalWindow = window;
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        href: 'http://localhost?test=1234',
      },
      configurable: true,
    });
    const param = getQueryParamsByName('test');

    expect(param).toBe('1234');

    // cleanup
    global.window = originalWindow;
  });
});
