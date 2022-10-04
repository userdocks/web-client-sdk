import { RequestType } from "./getTokenFromAPI";

export const getClientIdForRequest = (
  type: RequestType,
  clientId?: string,
  domain?: string,
) => {
  let cId = clientId;

  if (type === 'refresh') {
    cId = localStorage.getItem(`${domain}:clientId`) || '';
  } else {
    localStorage.setItem(`${domain}:clientId`, cId || '');
  }

  return cId;
};