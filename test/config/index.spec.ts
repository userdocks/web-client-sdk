import { config } from '../../src/config';

describe('config', () => {
  test('config.app.clientId === f0af4569-4d5d-4c20-af95-5a80c74e30a6', () => {
    expect(config?.app?.clientId).toBe('f0af4569-4d5d-4c20-af95-5a80c74e30a6');
  });
  test('config.app.origin === https://login.userdocks.com', () => {
    expect(config?.app?.origin).toBe('https://login.userdocks.com');
  });
  test('config.app.redirectUri === https://app.userdocks.com', () => {
    expect(config?.app?.redirectUri).toBe('https://app.userdocks.com');
  });
  test('config.authServer.domain === userdocks.com', () => {
    expect(config?.authServer?.domain).toBe('userdocks.com');
  });
  test('config.authServer.apiUri === userdocks.com', () => {
    expect(config?.authServer?.apiUri).toBe('https://api.userdocks.com');
  });
  test('config.authServer.loginUri === userdocks.com', () => {
    expect(config?.authServer?.loginUri).toBe('https://login.userdocks.com');
  });
});
