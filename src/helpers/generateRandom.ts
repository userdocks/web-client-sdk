export const generateRandomString = (length = 64, urlencode = true): string => {
  const array = new Uint8Array(length);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const cryptoObj = window.crypto || window.msCrypto;
  if (typeof cryptoObj !== 'undefined') {
    cryptoObj.getRandomValues(array);

    const randomString = btoa(String.fromCharCode.apply(null, array as any))
      .replace(/\+/g, '.')
      .replace(/\//g, '_')
      .replace(/=/g, '-')
      .slice(0, length);

    if (urlencode) {
      return randomString;
    }

    return randomString;
  }

  return (
    [...Array(length)]
      // eslint-disable-next-line no-bitwise
      .map(() => (~~(Math.random() * 36)).toString(36))
      .join('')
      .slice(0, length)
  );
};
