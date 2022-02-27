import { defaultMessageData } from '../../src/helpers/defaultMessageData';
import { messageData } from '../__fixtures__/messageData';

describe('defaultMessageData', () => {
  test('should be initialized with only null values', () =>
    expect(defaultMessageData).toEqual(messageData));
});
