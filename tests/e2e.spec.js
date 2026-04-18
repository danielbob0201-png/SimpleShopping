// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://10.191.52.44:30123';

test.describe('E-Commerce Checkout Flow', () => {

  test('should load the homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Frontend App - E-Commerce Demo/);
    await expect(page.locator('h1')).toContainText('Frontend App - E-Commerce Demo');
  });

  test('should add products to cart', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('0');
    await page.click('[data-testid="add-to-cart-1"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    await page.click('[data-testid="add-to-cart-2"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('2');
  });

  test('should show free shipping threshold message and qualify when enough', async ({ page }) => {
    await page.goto(BASE_URL);
    const shippingMsg = page.locator('[data-testid="shipping-message"]');
    // Initially below threshold
    await expect(shippingMsg).toBeVisible();
    await expect(shippingMsg).toContainText('free shipping');
    // Add two items ($29.99 x 2 = $59.98, which is >= $50)
    await page.click('[data-testid="add-to-cart-1"]');
    await page.click('[data-testid="add-to-cart-1"]');
    // Should now qualify
    await expect(shippingMsg).toContainText('qualify');
  });

  test('should complete checkout process', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('[data-testid="add-to-cart-1"]');
    await page.click('[data-testid="checkout-btn"]');
    await page.fill('[data-testid="checkout-name"]', 'Test User');
    await page.fill('[data-testid="checkout-email"]', 'test@example.com');
    await page.fill('[data-testid="checkout-address"]', '123 Test Street, Test City');
    await page.click('[data-testid="submit-order"]');
    // Expects order confirmation to appear after successful checkout
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible({ timeout: 5000 });
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('[data-testid="add-to-cart-1"]');
    await page.click('[data-testid="checkout-btn"]');
    // Try to submit without filling required fields
    await page.click('[data-testid="submit-order"]');
    // Confirmation should NOT appear (HTML5 validation prevents submission)
    await expect(page.locator('[data-testid="order-confirmation"]')).not.toBeVisible();
    // Error should also NOT appear (form was not submitted at all)
    await expect(page.locator('[data-testid="checkout-error"]')).not.toBeVisible();
  });

  test('should display PR information', async ({ page }) => {
    await page.goto(BASE_URL);
    const prInfo = page.locator('[data-testid="pr-info"]');
    await expect(prInfo).toBeVisible();
    await expect(prInfo).toContainText('#123');
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto(BASE_URL);
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="add-to-cart-1"]')).toBeVisible();
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="add-to-cart-1"]')).toBeVisible();
  });

  test('should remove items from cart', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('[data-testid="add-to-cart-1"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    await expect(page.locator('[data-testid="cart-item-0"]')).toBeVisible();
    await page.click('[data-testid="remove-0"]');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('0');
    await expect(page.locator('[data-testid="cart-item-0"]')).not.toBeVisible();
  });

  test('should apply SAVE10 coupon and update discount summary', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('[data-testid="add-to-cart-1"]');
    const discountSummary = page.locator('[data-testid="discount-summary"]');
    await expect(discountSummary).not.toBeVisible();
    await page.fill('[data-testid="coupon-input"]', 'SAVE10');
    await page.click('[data-testid="apply-coupon"]');
    await expect(discountSummary).toBeVisible();
    await expect(discountSummary).toContainText('SAVE10');
    await expect(discountSummary).toContainText('-$10.00');
  });

  test('should calculate tax after discount (business rule)', async ({ page }) => {
    await page.goto(BASE_URL);
    // Add product A: $29.99
    await page.click('[data-testid="add-to-cart-1"]');
    // Apply SAVE10 coupon: -$10.00
    await page.fill('[data-testid="coupon-input"]', 'SAVE10');
    await page.click('[data-testid="apply-coupon"]');
    // Tax should be calculated on discounted amount:
    // ($29.99 - $10.00) * 10% = $19.99 * 10% = $2.00 (rounded)
    // Business rule: tax applies after discount
    const taxElement = page.locator('[data-testid="tax-amount"]');
    await expect(taxElement).toContainText('$2.00');
  });

  test('performance: should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    // Should load in under 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

});
