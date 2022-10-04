import { RequestType } from "./getTokenFromAPI";

const paths = {
  refresh: '/rest/pc/refresh',
  exchangeCodeForToken: '/rest/pc/login/oauth/identity/token',
};

export const requestUrl = (type: RequestType, baseUri: string) => {
  const path = paths[type];
  const url = `${baseUri.replace(
    /\/$/,
    ''
  )}${path}`;

  return url;
};

