import { TTokenType } from "../../types";
import { jwtDecode } from "../jwtDecode";

export const getTokenPayload = (token: string | null, type: TTokenType) => {
  const t = jwtDecode(token, type);

  return t.payload[type];
};