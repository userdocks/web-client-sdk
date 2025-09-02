import { RequestType } from './getTokenFromAPI';

export type Session = '1' | '0';

export const getSession = (
  type: RequestType,
  domain: string,
  session: Session
) => {
  let s;

  switch (type) {
    case 'refresh':
      s = (localStorage.getItem(`${domain}:session`) as Session) || session;
      break;
    case 'exchangeCodeForToken':
    default:
      s = session;
      localStorage.setItem(`${domain}:session`, s);
  }

  return s;
};

export const getRefreshToken = (domain: string) => {
  const key = `${domain}:refreshToken`;
  const value = localStorage.getItem(key);

  return value;
};

export const setRefreshToken = (domain: string, refreshToken?: string) => {
  const key = `${domain}:refreshToken`;
  localStorage.setItem(key, refreshToken || '');
};
