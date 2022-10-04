import { IOptions } from "../types";
import { getOptions } from "./getOptions";
import { getQueryParams } from "./getQueryParams";

export const isLoggedIn = (options: IOptions) => {
  const { domain } = getOptions(options);
  const { keepMeLoggedIn } = getQueryParams();

  if (
    localStorage.getItem(`${domain}:session`) === '0'
    &&  keepMeLoggedIn === 'true'
  ) {
    return true;
  }

  return false;
};
