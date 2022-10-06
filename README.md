# **@userdocks/web-client-sdk**

![npm](https://img.shields.io/npm/v/@userdocks/nodejs-server-sdk?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/userdocks/web-client-sdk/build?style=flat-square)
![Coveralls branch](https://img.shields.io/coveralls/github/userdocks/web-client-sdk/main?style=flat-square)
![NPM](https://img.shields.io/npm/l/@userdocks/web-client-sdk?style=flat-square)

> The JavaScript web client SDK for userdocks. Securly store, access, and refresh access tokens in your browser application.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Methods](#methods)
  - [userdocks.initialize](#userdocksinitialize)
  - [userdocks.isInitialized](#userdocksisinitialized)
  - [userdocks.terminate](#userdocksterminate)
  - [userdocks.exchangeCodeForToken](#userdocksexchangecodefortoken)
  - [userdocks.getToken](#userdocksgettoken)
  - [userdocks.silentRefresh](#userdockssilentrefresh)
  - [userdocks.refreshefresh](#userdockssilentrefresh)
  - [userdocks.redirectTo](#userdocksredirectto)
  - [userdocks.logout](#userdockslogout)
  - [userdocks.generateState](#userdocksgeneratestate)
- [Usage for Development](#usage-for-development)

## **Install**

```bash
npm i @userdocks/web-client-sdk
```

## **Usage**

Use the module in the project:

```js
import userdocks from '@userdocks/web-client-sdk';

const options = {
  // e.g. if using a cname
  authServer: {
    domain: `<domain-of-the-auth-server>`
    apiUri: '<the-payment-uri-of-your-application>',
    paymentUri: '<the-payment-uri-of-your-application>',
    loginUri: '<the-payment-uri-of-your-application>',
    sdkUri: '<the-payment-uri-of-your-application>',
  },
  app: {
    refreshType: '<refresh> or <silentRefresh>'
    origin: '<the-uri-of-your-application>',
    clientId: '<an-uuid-of-an-application-on-uderdocks>',
    redirectUri: '<the-redirect-uri-of-your-application>',
  },
};

// initialize userdocks with your config
await userdocks.initialize(options);
// if you want to destroy the store of your tokens
userdocks.terminate();

await userdocks.exchangeCodeForToken();
await userdocks.getToken();
await userdocks.refresh();
// only if refreshType in your options is silentRefresh
await userdocks.silentRefresh();
userdocks.redirectTo({ type: 'signIn' });
await userdocks.logout();'
```

## **Methods**

Documentation of all the functions and methods this SDK exposes.

### **userdocks.initialize**

This method must be called before using any other methods.

**Syntax**

Returns a promise

```js
import userdocks from '@userdocks/web-client-sdk';

await userdocks.initialize(options);
```

**Parameters**

- **options** `<object>`: an object holding two key value pairs
  - **authServer** `<object | undefined>`: an object holding four key value pairs
    - **domain** `<string | undefined>`: the domain of the authetication server (_optional_)
    - **apiUri** `<string | undefined>`: the uri of the api of the authetication server (_optional_)
    - **paymentUri** `<string | undefined>`: the uri of the payment page of the authetication server (_optional_)
    - **loginUri** `<string | undefined>`: the uri of the login page of the authetication server (_optional_)
    - **sdkUri** `<string | undefined>`: the uri of the SDK of the authetication server (_optional_)
  - **app** `<object>`: an object holding three key value pairs
    - **refreshType**: `<'silentRefresh' | 'refresh'>`: How to refresh your authorization tokens (_optional_)
      - *silentRefresh*: uses cookies and an iframe for refreshing the tokens (authServer is required with this option)
      - *refresh*: uses the localStorage or sessionStorage (only for the refresh token, the access token is only stored in memory) and an HTTP request to refresh the tokens (default value)
    - **origin** `<string>`: the uri of the client application (_required_)
    - **clientId** `<string>`: the UUID of an userdocks application (_required_)
    - **redirectUri** `<string>`: the redirect uri of the userdocks application (_required_)

**Return Value**

- **undefined** `<undefined>`

### **userdocks.isInitialized**

Returns a boolean indicating if the userdocks object is already initialized.

**Syntax**

```js
import userdocks from '@userdocks/web-client-sdk';

userdocks.isInitialized();
```

**Return Value**

- **isInitialized** `<boolean>`

### **userdocks.terminate**

Returns void and resets the store and web worker of userdocks.

**Syntax**

```js
import userdocks from '@userdocks/web-client-sdk';

userdocks.terminate();
```

**Return Value**

- **undefined** `<undefined>`

### **userdocks.exchangeCodeForToken**

> **Note:** This method is used on the callback page e.g. the redirect uri

Returns a promise that should resolve to a boolean that indicates if an exchange for a token was successful or not.

**Syntax**

Returns a promise that should resolve a boolean.

```js
import userdocks from '@userdocks/web-client-sdk';

const isSuccessfulExchange = await userdocks.exchangeCodeForToken();
```

**Return Value**

- **isSuccessfulExchange** `<boolean>`: a promise that should resolve a boolean

### **userdocks.getToken**

Returns a promise that should resolve a token object.

**Syntax**

Returns a boolean that should resolve a new object.

```js
import userdocks from '@userdocks/web-client-sdk';
const token = await userdocks.getToken(getTokenOptions);
```

**Parameters**

- **getTokenOptions** `<object | undefined>`
  - **refresh** `<boolean>`: If set to true it will automatically refresh the token. Default: `false`

**Return Value**

- **token** `<object>`: a promise that should resolve an object holding 6 key value pairs
  - **tokenType** `<"Bearer" | null>`
  - **expiresIn** `<number | null>`: time the token is valid in `ms`
  - **redirectUri** `<string | null>`
  - **idToken** `<string | null>`
  - **accessToken** `<string | null>`
  - **refreshToken** `<string | null>`

### **userdocks.silentRefresh**

> **Note:** This method is used when a request fails or the json web token is expired or will expire in near future

> **Note:** This method of refreshing tokens can only be used with CNAMES. Otherwise this will not refresh your tokens when your client has set its cookie settings to disallow third-party-cookies

Returns a promise that should resolve to a boolean that indicates if an refresh of the tokens was successful or not.

**Syntax**

Returns a promise that should resolve a boolean.

```js
import userdocks from '@userdocks/web-client-sdk';

const isSuccessfulExchange = await userdocks.silentRefresh();
```

**Return Value**

- **isSuccessfulExchange** `<boolean>`: a promise that should resolve a boolean

### **userdocks.refresh**

> **Note:** This method is used when a request fails or the json web token is expired or will expire in near future

> **Note:** This method is the default method of refreshing tokens

Returns a promise that should resolve to a boolean that indicates if an refresh of the tokens was successful or not.

**Syntax**

Returns a promise that should resolve a boolean.

```js
import userdocks from '@userdocks/web-client-sdk';

const isSuccessfulExchange = await userdocks.refresh();
```

**Return Value**

- **isSuccessfulExchange** `<boolean>`: a promise that should resolve a boolean

### **userdocks.redirectTo**

Returns a string setting the `window.location.href` to the 'signIn' or 'signUp' page.

**Syntax**

Returns a string.

```js
import userdocks from '@userdocks/web-client-sdk';

userdocks.redirectTo({
  type: 'signIn',
});
```

**Parameters**

- **options** `<object>`: an object holding two keys
  - **payment** `<object>`: an object holding 3 keys (_optional_) (_required_ if type is set to `<payment>`)
    - **sessionId**: the id of your checkout session created via the rest api
    - **hash**: the hash of the session created via the rest api
    - **state**: a 64 character long state that you generated on your client and will be challenged on the server when accessing the payment page
  - **type**: `<'signIn' | 'signUp' | 'unauthenticated' | 'logout' | 'payment'>`: use `signIn` or `signUp` to redirect to the sign in or sign up page. Use `payment` to redirect to the payment page. Use `unauthenticated` to redirect after an unauthenticated access to your page or after a refresh failed. Use `logout` when logging out users without clearing your refresh token (otherwise use the logout function).

**Return Value**

- **string** `<string>`

### **userdocks.logout**

Returns a promise that should resolve void.

**Syntax**

```js
import userdocks from '@userdocks/web-client-sdk';

await userdocks.logout();
```

**Return Value**

- **logout** `<void>`


### **userdocks.generateState**

Returns a random string that can be used for generating a client site state for e.g. a payment page.

**Syntax**

```js
import userdocks from '@userdocks/web-client-sdk';

const state = await userdocks.generateState(64);
```

**Parameters**

- **length** `<number>`: an integer defining the length of the state

**Return Value**

- **state** `<string>`: a random string matching the length of the input parameter

## **Usage for Development**

Start the watcher and link the package locally:

```bash
npm run watch
npm run link
```

Link the package in the project where it will be used:

```bash
# if you run "npm i" in your project you need to re-run this command
npm link @userdocks/web-client-sdk
```

To use this module with typescript and with npm link add the follwing to your tsconfig.json:

```json
{
  "compilerOptions": {
    "paths": {
      "@userdocks/web-client-sdk": [
        "./node_modules/@userdocks/web-client-sdk/dist"
      ]
    }
  }
}
```
