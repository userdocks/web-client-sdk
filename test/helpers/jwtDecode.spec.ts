import { jwtDecode } from '../../src/helpers/jwtDecode';
import {
  accessToken,
  accessTokenPayload,
  idToken,
  idTokenPayload,
} from '../__fixtures__/jwt';

describe('jwtDecode', () => {
  test('id token', () => {
    const decodedToken = jwtDecode(idToken, 'id');

    expect(decodedToken.raw).toBe(idToken);
    expect(decodedToken.payload.access).toBe(null);
    expect(decodedToken.payload.id).toEqual(idTokenPayload);
  });
  test('access token', () => {
    const decodedToken = jwtDecode(accessToken, 'access');

    expect(decodedToken.raw).toBe(accessToken);
    expect(decodedToken.payload.id).toBe(null);
    expect(decodedToken.payload.access).toEqual(accessTokenPayload);
  });
});
