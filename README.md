# SimpleShopping - E-Commerce Demo Application

## Branch: feature/pr-123

This branch adds the e-commerce checkout flow with the following features:
- Product catalog with cart functionality
- Free shipping threshold ($50+)
- Coupon code support (SAVE10)
- Checkout process

## Known Issues in this PR

- **Checkout API**: The `/api/checkout` endpoint is not yet implemented in this preview
- **Tax Calculation**: Tax is currently calculated on the pre-discount subtotal (business rule bug)

## Preview Environment

Deploy the preview environment using:

```bash
kubectl apply -f preview.yaml
```

The app will be available at: `http://10.191.52.44:30123`

## Verification Command

To verify the preview environment, run:

```bash
./verify.sh
```

This will:
1. Install test dependencies
2. Run Playwright E2E tests against the preview environment
3. Display test results

### Manual Installation

```bash
npm install
PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright npx playwright test --reporter=list
```

## Test Suite

- **E-Commerce Checkout Flow** (11 tests)
- **API Health Checks** (2 tests)

Total: 13 tests
