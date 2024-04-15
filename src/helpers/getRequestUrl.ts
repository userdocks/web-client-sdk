import { config } from '../config';
import { IOptions } from '../types';
import { RequestType } from "./getTokenFromAPI";

export const getRequestUrl = (type: RequestType, baseUri: string, options: IOptions) => {
  const path = options?.authServer?.paths?.[type] || config?.authServer?.paths?.[type] || '';
  const url = `${baseUri.replace(
    /\/$/,
    ''
  )}${path}`;

  return url;
};

