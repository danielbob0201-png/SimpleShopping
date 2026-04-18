// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://10.191.52.44:30123';

test.describe('API Health Checks', () => {

  test('should return 200 status for homepage', async ({ request }) => {
    const response = await request.get(BASE_URL);
    expect(response.status()).toBe(200);
  });

  test('should have correct headers', async ({ request }) => {
    const response = await request.get(BASE_URL);
    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/text\/html/);
  });

});
