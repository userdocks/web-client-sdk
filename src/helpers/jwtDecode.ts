import { IDecodedJWT, TTokenType } from '../types';

export const jwtDecode = (
  token: string | null,
  type: TTokenType
): IDecodedJWT => {
  let t: IDecodedJWT = {
    raw: null,
    header: {
      alg: null,
      typ: null,
    },
    payload: {
      access: null,
      id: null,
    },
  };
  try {
    if (token) {
      const payload = JSON.parse(atob(token?.split('.')[1]));
      const header = JSON.parse(atob(token?.split('.')[0]));

      t = {
        raw: token,
        header,
        payload: {
          access: type === 'access' ? payload : null,
          id: type === 'id' ? payload : null,
        },
      };
    }
  } catch (err) {
    console.warn(
      'A attempt to parse the token failed. Make sure that all properties of the config object are correct.'
    );
  }

  return t;
};
