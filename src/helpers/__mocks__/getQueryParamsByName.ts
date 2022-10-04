export const getQueryParamsByName = jest.fn().mockImplementation(arg => {
  switch (arg) {
    case 'redirect_uri':
      return 'http://localhost/';
    case 'client_id':
      return 'f0af4569-4d5d-4c20-af95-5a80c74e30a6';
    case 'grantType':
      return 'authorization_code';
    case 'nonce':
      return '30e9651e-3e4d-4a67-94bc-b35edb9924be';
    case 'session':
      return '1';
    case 'keepMeLoggedIn':
      return '';
    default:
      return '30e9651e-3e4d-4a67-94bc-b35edb9924be';
  }
});
