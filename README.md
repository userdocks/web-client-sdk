# **@userdocks/web-client-sdk**

![npm](https://img.shields.io/npm/v/@userdocks/nodejs-server-sdk?style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/userdocks/web-client-sdk/build?style=flat-square)
![Coveralls branch](https://img.shields.io/coveralls/github/userdocks/web-client-sdk/main?style=flat-square)
![NPM](https://img.shields.io/npm/l/@userdocks/web-client-sdk?style=flat-square)

> The JavaScript web client SDK for userdocks. Securly store, access, and refresh access tokens in your browser application.

## Table of Contents

- [Install](#install)
- [Methods](#methods)
  - [userdocks.initialize](#userdocksinitialize)
  - [userdocks.terminate](#userdocksterminate)
  - [userdocks.exchangeCodeForToken](#userdocksexchangecodefortoken)
  - [userdocks.getToken](#userdocksgettoken)
  - [userdocks.silentRefresh](#userdockssilentrefresh)
  - [userdocks.redirectTo](#userdocksredirectto)
  - [userdocks.logout](#userdockslogout)
- [Usage](#usage)
- [Usage for Development](#usage-for-development)

## **Install**

```bash
npm i @userdocks/web-client-sdk
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
    - **apiUri** `<string | undefined>`: the uri of the api of the authetication server (_optional_)
    - **domain** `<string | undefined>`: the domain of the authetication server (_optional_)
    - **loginUri** `<string | undefined>`: the uri of the login page of the authetication server (_optional_)
    - **sdkUri** `<string | undefined>`: the uri of the SDK of the authetication server (_optional_)
  - **app** `<object>`: an object holding three key value pairs
    - **origin** `<string>`: the uri of the client application (_required_)
    - **clientId** `<string>`: the UUID of an userdocks application (_required_)
    - **redirectUri** `<string>`: the redirect uri of the userdocks application (_required_)

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

- **token** `<object>`: a promise that should resolve an object holding 5 key value pairs
  - **tokenType** `<"Bearer" | null>`
  - **expiresIn** `<number | null>`: time the token is valid in `ms`
  - **redirectUri** `<string | null>`
  - **idToken** `<string | null>`
  - **accessToken** `<string | null>`

### **userdocks.silentRefresh**

> **Note:** This method is used when a request fails or the json web token is expired or will expire in near future

Returns a promise that should resolve to a boolean that indicates if an refresh of the tokens was successful or not.

**Syntax**

Returns a promise that should resolve a boolean.

```js
import userdocks from '@userdocks/web-client-sdk';

const isSuccessfulExchange = await userdocks.silentRefresh();
```

**Return Value**

- **isSuccessfulExchange** `<boolean>`: a promise that should resolve a boolean

### **userdocks.redirectTo**

Returns a string setting the `window.location.href` to the 'signIn' or 'signUp' page.

**Syntax**

Returns a string.

```js
import userdocks from '@userdocks/web-client-sdk';

userdocks.redirectTo(redirectType);
```

**Parameters**

- **redirectType** `<"signIn" | "signUp">`

**Return Value**

- **string** `<string>`

### **userdocks.logout**

Returns a promise that should resolve to an object that holds the loginUri.

**Syntax**

```js
import userdocks from '@userdocks/web-client-sdk';

const logoutObj = await userdocks.logout();
```

**Return Value**

- **logoutObj** `<object>`: a promise that should resolve to an object holding two key value pairs
  - **success** `<boolean>`
  - **loginUri** `<string>`

## **Usage**

Use the module in the project:

```js
import getUserdocks from '@userdocks/web-client-sdk';

const config = {
  authServer: {
    apiUri: '<the-uri-of-an-auth-server-api>',
    loginUri: '<the-uri-of-an-auth-server-login>',
    sdkUri: '<the-uri-of-an-auth-server-sdk>',
  },
  app: {
    origin: '<the-uri-of-your-application>',
    clientId: '<an-uuid-of-an-application-on-uderdocks>',
    redirectUri: '<the-redirect-uri-of-your-application>',
  },
};

const userdocks = await getUserdocks(config);

await userdocks.exchangeCodeForToken();
await userdocks.getToken();
await userdocks.silentRefresh();
userdocks.redirectTo('signIn'); // 'signUp'
await userdocks.logout();'
```

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
