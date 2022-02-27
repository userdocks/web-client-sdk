import getUserdocks from '.';

export interface IToken {
  tokenType: 'Bearer' | null;
  expiresIn: number | null;
  redirectUri: string | null;
  accessToken: string | null;
  idToken: string | null;
}

export type TRequestType = 'getToken' | 'setToken' | 'deleteToken' | null;

export interface IMessageData {
  request: {
    type: TRequestType;
  };
  payload: IToken | { uuid: string; token: IToken };
}

export interface ISilentRefreshData {
  isAllowed?: boolean | null;
  success: boolean | null;
  loginUri: string | null;
  token: IToken | null;
}

export interface IAccessTokenPayload {
  iss: string;
  sub: string;
  aud: string;
  lng: string;
  jti: string;
  exp: string;
  nonce: string;
  auth_time: number;
  scope: string[];
  psc: any[];
}

export interface IAddress {
  formatted?: string;
  street_address?: string;
  locality?: string;
  region?: string;
  postal_code?: string;
  country?: string;
}

export interface IIdTokenPayload {
  iss: string;
  sub: string;
  aud: string;
  lng: string;
  jti: string;
  exp: string;
  nonce: string;
  auth_time: number;
  scope: string[];
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  email?: string;
  email_verified?: string;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phone_number?: string;
  phone_number_verified?: string;
  address?: IAddress;
  updated_at?: number;
}

export interface IDecodedJWT {
  raw: string | null;
  header: {
    alg: string | null;
    typ: string | null;
  };
  payload: {
    access: IAccessTokenPayload | null;
    id: IIdTokenPayload | null;
  };
}

export type TTokenType = 'access' | 'id';

export interface IOptions {
  authServer?: {
    apiUri?: string;
    domain?: string;
    loginUri?: string;
    sdkUri?: string;
  };
  app: {
    origin?: string;
    clientId?: string;
    redirectUri?: string;
  };
}

export interface IToken {
  tokenType: 'Bearer' | null;
  expiresIn: number | null;
  redirectUri: string | null;
  accessToken: string | null;
  idToken: string | null;
}

export interface ITokenResponse {
  token_type: 'Bearer' | null;
  expires_in: number | null;
  redirect_uri: string | null;
  access_token: string | null;
  id_token: string | null;
}

export interface ILogout {
  success: boolean;
  loginUri: string | null;
}

export interface IMessageDataSilentRefresh extends IToken {
  isAllowed?: boolean;
}

export interface IMessagePayload {
  payload: IToken | { isTokenSet: boolean } | { uuid: string };
}

export interface User {
  email: string | null;
  email_verified: boolean;
  appId: string;
  acceptedNewsletter: boolean;
  acceptedNewsletterDate: string | null;
  lastAskedNewsletterSignUp: string | null;
  birthdate: string | null;
  deleted: boolean;
  family_name: string | null;
  freezed: boolean;
  gender: string | null;
  given_name: string | null;
  id: string;
  language: string;
  locale: string | null;
  middle_name: string | null;
  name: string | null;
  nickname: string | null;
  phone_number: string | null;
  phone_number_verified: string | null;
  picture: string | null;
  preferred_username: string | null;
  profile: string | null;
  salutation: string | null;
  salutationOther: string | null;
  tenantId: string;
  verified_by_admin: boolean;
  website: string | null;
  zoneinfo: string | null;
}

export interface Address {
  id: String;
  name: String;
  city: String;
  country: String;
  line1: String;
  line2: String;
  postal_code: String;
  state: String;
  type: String;
}

export interface Tenant {
  id: string;
  name: string | null;
  stripePaymentMethod: string | null;
  stripePriceId: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  stripeDefaultPaymentMethodId: string | null;
  companyName: string | null;
  companyTaxExempt: string | null;
  companyTaxType: string | null;
  companyVATId: string | null;

  // todo check if existing
  mode: string;
  paymentFailedCount: number;
  paymentFailed: boolean;

  billingAddress: Address;
  shippingAddress: Address;
  freeUnits: number | null;
  paidUnits: number | null;
  freeUntil: string | null;
  paidUntil: string | null;
  stripeSubscriptionCancelAt: string | null;
  stripeSubscriptionCancelAtPeriodEnd: boolean | null;

  description: unknown;
  freezed: unknown;
  freezedDueFailedPayment: unknown;
  paymentFailedDate: unknown;
  stripeProductId: unknown;
  users: User[];
}

export type TRedirectType = 'signIn' | 'signUp';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
export type TUserdocks = UnPromisify<ReturnType<typeof getUserdocks>>;
