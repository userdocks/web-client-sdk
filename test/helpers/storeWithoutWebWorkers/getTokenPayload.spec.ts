import { getTokenPayload } from '../../../src/helpers/storeWithoutWebWorker/getTokenPayload';
import {
  accessToken,
  accessTokenPayload,
  idToken,
  idTokenPayload,
} from '../../__fixtures__/jwt';

describe('getTokenPayload', () => {
  test('id token should return the payload', () => {
    const tokenPayload = getTokenPayload(idToken, 'id');

    expect(tokenPayload).toEqual(idTokenPayload);
  });
  test('access token should return the payload', () => {
    const tokenPayload = getTokenPayload(accessToken, 'access');

    expect(tokenPayload).toEqual(accessTokenPayload);
  });
});
