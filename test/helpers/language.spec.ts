import language from '../../src/helpers/language';

describe('language', () => {
  test('default to en ', () => {
    const lang = language();

    expect(lang).toBe('en');
  });
  test('get from path ', () => {
    // setup
    const originalWindow = window;
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/de/whatever',
      },
      configurable: true,
    });
    const lang = language();

    expect(lang).toBe('de');

    global.window = originalWindow;
  });
  test('get from path with locale ', () => {
    // setup
    const originalWindow = window;
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/de-AT/whatever',
      },
      configurable: true,
    });
    const lang = language();

    expect(lang).toBe('de');

    global.window = originalWindow;
  });
});
