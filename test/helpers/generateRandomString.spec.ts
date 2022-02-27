import { generateUuid } from '../../src/helpers/generateUuid';

describe('generateUuid', () => {
  test('should return a uuid formatted string', async () => {
    const data = await generateUuid();

    expect(data.length).toBe(36);
    expect((data.match(/-/g) || []).length).toBe(4);
  });
});
