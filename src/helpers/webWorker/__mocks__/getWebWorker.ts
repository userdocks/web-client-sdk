export const getWebWorker = jest.fn().mockResolvedValue({
  terminate: jest.fn(),
  onmessage: jest.fn(),
  postMessage: jest.fn(),
});
