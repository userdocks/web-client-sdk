import { RequestType } from "./getTokenFromAPI";

export type Session = '1' | '0';

export const getSession = (type: RequestType, domain: string, session: Session) => {
  let s;

  switch(type) {
    case 'refresh':
      s = localStorage.getItem(`${domain}:session`) as Session || session;
      break;
    case 'exchangeCodeForToken':
    default:
      s = session;
      localStorage.setItem(`${domain}:session`, s);
  }

  return s;
};

export const getRefreshTokenStore = (type: RequestType, domain: string, session: Session) => {
  const s = getSession(type, domain, session);

  if (s === '1') {
    return sessionStorage;
  }

  return localStorage;
}

export const getRefreshToken = (type: RequestType, domain: string, session: Session) => {
  const key = `${domain}:refreshToken`;
  const value = getRefreshTokenStore(type, domain,session).getItem(key);

  return value;
};

export const refreshTokenStore = (type: RequestType, domain: string, session: Session) => {
  return getRefreshTokenStore(type, domain, session);
};

export const setRefreshToken = (
  type: RequestType,
  domain: string,
  session: Session,
  refreshToken?: string
) => {
  const key = `${domain}:refreshToken`;
  getRefreshTokenStore(type, domain,session).setItem(key, refreshToken || '');
};