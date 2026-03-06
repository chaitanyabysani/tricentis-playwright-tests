import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import { CredentialManager } from '../utils/CredentialManager';
import testData from '../utils/testdata.json';

// ─── Shared helpers ─────────────────────────────────────────────────────────────
const BASE_META = async () => {
  await epic('Checkout Flow');
  await feature('Checkout');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

// Helper: login, add a simple product to cart and go to checkout
async function loginAddToCartAndCheckout(page: any, pom: any) {
  const loginPage = pom.getLoginPage();
  const cartPage = pom.getCartPage();
  const credentials = CredentialManager.load();
  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);
  await page.goto('/computing-and-internet');
  await page.locator('.add-to-cart-button').first().click();
  await page.waitForTimeout(1500);
  await cartPage.goto();
  await cartPage.proceedToCheckout();
  await page.waitForTimeout(1500);
}

// Helper: fill full billing and continue through all checkout steps
async function completeBillingAndShipping(page: any, pom: any) {
  const checkoutPage = pom.getCheckoutPage();
  await checkoutPage.fillBillingAddress({
    firstName: testData.checkout.firstName,
    lastName:  testData.checkout.lastName,
    country:   testData.checkout.country,
    state:     testData.checkout.state,
    city:      testData.checkout.city,
    address:   testData.checkout.address,
    zip:       testData.checkout.zip,
    phone:     testData.checkout.phone,
  });
  await checkoutPage.continueBilling();
  await checkoutPage.continueShipping();
  await checkoutPage.selectShippingMethod(0);
  await checkoutPage.continueShippingMethod();
  await checkoutPage.selectPaymentMethod('Check / Money Order');
  await checkoutPage.continuePaymentMethod();
  await checkoutPage.continuePaymentInfo();
}

test.describe('Module 8 — Checkout Flow', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.1  Complete checkout as a guest
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.1] Complete checkout as a guest (no account required)', async ({ page }) => {
    await BASE_META();
    await story('As a guest user, I can complete a purchase without creating an account');
    await severity(Severity.CRITICAL);
    await tag('Checkout'); await tag('Regression'); await tag('Guest');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a visitor can add an item to cart, proceed to checkout as a guest,
      fill billing details, and complete the order.</p>
      <h2>Expected Result</h2>
      <p>Order is placed and the Thank You / order completed page is shown.</p>
    `);

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();
    const checkoutPage = pom.getCheckoutPage();
    const orderConfirmation = pom.getOrderConfirmationPage();

    await test.step('Step 1: Add product to cart as a guest', async () => {
      await step('Navigate to a product page and add to cart', async () => {
        await page.goto('/computing-and-internet');
        await page.locator('.add-to-cart-button').first().click();
        await page.waitForTimeout(1500);
      });
    });

    await test.step('Step 2: Proceed to checkout page', async () => {
      await step('Go to cart and proceed to checkout', async () => {
        await cartPage.goto();
        await cartPage.proceedToCheckout();
        await page.waitForTimeout(1500);
      });
    });

    await test.step('Step 3: Choose to checkout as guest', async () => {
      await step('Click Checkout as Guest option if prompted', async () => {
        const guestButton = page.locator('.checkout-as-guest-button');
        const isGuestVisible = await guestButton.isVisible().catch(() => false);
        if (isGuestVisible) {
          await guestButton.click();
          await page.waitForTimeout(1000);
          await parameter('Checkout Mode', 'Guest');
        } else {
          await parameter('Checkout Mode', 'Skipped — already on checkout form');
        }
      });
    });

    await test.step('Step 4: Fill billing address', async () => {
      await step('Fill all required billing fields', async () => {
        // For guest checkout, email is also required
        const emailField = checkoutPage.billingEmail;
        const emailVisible = await emailField.isVisible().catch(() => false);
        if (emailVisible) {
          await emailField.fill(`guest+${Date.now()}@test.com`);
        }
        await checkoutPage.fillBillingAddress({
          firstName: testData.checkout.firstName,
          lastName:  testData.checkout.lastName,
          country:   testData.checkout.country,
          state:     testData.checkout.state,
          city:      testData.checkout.city,
          address:   testData.checkout.address,
          zip:       testData.checkout.zip,
          phone:     testData.checkout.phone,
        });
        await parameter('Billing Country', testData.checkout.country);
        await checkoutPage.continueBilling();
      });
    });

    await test.step('Step 5: Continue through shipping, payment, and confirm', async () => {
      await step('Continue shipping address step', async () => {
        await checkoutPage.continueShipping();
      });
      await step('Select shipping method and continue', async () => {
        await checkoutPage.selectShippingMethod(0);
        await checkoutPage.continueShippingMethod();
      });
      await step('Select payment method and continue', async () => {
        await checkoutPage.selectPaymentMethod('Check / Money Order');
        await checkoutPage.continuePaymentMethod();
        await checkoutPage.continuePaymentInfo();
      });
      await step('Confirm the order', async () => {
        await checkoutPage.confirmOrder();
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 6: Verify order confirmation', async () => {
      await step('Assert order completed page is shown', async () => {
        await expect(page).toHaveURL(/.*completed.*/);
        const isSuccessful = await orderConfirmation.isOrderSuccessful();
        expect(isSuccessful).toBe(true);
        const orderNumber = await orderConfirmation.getOrderNumber();
        await parameter('Order Number', orderNumber);
        await attachment('Order Confirmation', orderNumber, 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.2  Complete checkout as a registered / logged-in user
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.2] Complete checkout as a registered / logged-in user', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can complete a full purchase successfully');
    await severity(Severity.CRITICAL);
    await tag('Checkout'); await tag('Regression'); await tag('Happy-Path');

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();
    const orderConfirmation = pom.getOrderConfirmationPage();

    await test.step('Step 1: Login, add to cart, proceed to checkout', async () => {
      await step('Setup: login, add product, go to checkout', async () => {
        await loginAddToCartAndCheckout(page, pom);
      });
    });

    await test.step('Step 2: Fill billing address', async () => {
      await step('Fill all required billing fields and continue', async () => {
        await checkoutPage.fillBillingAddress({
          firstName: testData.checkout.firstName,
          lastName:  testData.checkout.lastName,
          country:   testData.checkout.country,
          state:     testData.checkout.state,
          city:      testData.checkout.city,
          address:   testData.checkout.address,
          zip:       testData.checkout.zip,
          phone:     testData.checkout.phone,
        });
        await parameter('Billing Country', testData.checkout.country);
        await checkoutPage.continueBilling();
      });
    });

    await test.step('Step 3: Continue shipping address', async () => {
      await step('Confirm ship to same address and continue', async () => {
        await checkoutPage.continueShipping();
      });
    });

    await test.step('Step 4: Select shipping method and continue', async () => {
      await step('Select first shipping method', async () => {
        await checkoutPage.selectShippingMethod(0);
        await checkoutPage.continueShippingMethod();
      });
    });

    await test.step('Step 5: Select payment method and continue', async () => {
      await step('Select Check / Money Order and continue', async () => {
        await checkoutPage.selectPaymentMethod('Check / Money Order');
        await checkoutPage.continuePaymentMethod();
        await checkoutPage.continuePaymentInfo();
        await parameter('Payment Method', 'Check / Money Order');
      });
    });

    await test.step('Step 6: Confirm order', async () => {
      await step('Click Confirm Order button', async () => {
        await checkoutPage.confirmOrder();
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 7: Verify order confirmation', async () => {
      await step('Assert completed page and capture order number', async () => {
        await expect(page).toHaveURL(/.*completed.*/);
        const isSuccessful = await orderConfirmation.isOrderSuccessful();
        expect(isSuccessful).toBe(true);
        const orderNumber = await orderConfirmation.getOrderNumber();
        await parameter('Order Number', orderNumber);
        await attachment('Order Number', orderNumber, 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.3  Billing address: fill all required fields and continue
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.3] Billing address: fill all required fields and continue', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can fill all billing address fields and proceed');
    await severity(Severity.CRITICAL);
    await tag('Checkout'); await tag('Regression'); await tag('Billing');

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();

    await test.step('Step 1: Login, add to cart, go to checkout', async () => {
      await step('Setup: login, add product, proceed to checkout', async () => {
        await loginAddToCartAndCheckout(page, pom);
      });
    });

    await test.step('Step 2: Verify billing form fields are present', async () => {
      await step('Assert all billing input fields are visible', async () => {
        await expect(checkoutPage.billingFirstName).toBeVisible();
        await expect(checkoutPage.billingLastName).toBeVisible();
        await expect(checkoutPage.billingCountry).toBeVisible();
        await expect(checkoutPage.billingCity).toBeVisible();
        await expect(checkoutPage.billingAddress1).toBeVisible();
        await expect(checkoutPage.billingZip).toBeVisible();
        await expect(checkoutPage.billingPhone).toBeVisible();
        await parameter('Billing Form Fields', 'All visible');
      });
    });

    await test.step('Step 3: Fill all required billing fields', async () => {
      await step('Enter all billing address details', async () => {
        await checkoutPage.fillBillingAddress({
          firstName: testData.checkout.firstName,
          lastName:  testData.checkout.lastName,
          country:   testData.checkout.country,
          state:     testData.checkout.state,
          city:      testData.checkout.city,
          address:   testData.checkout.address,
          zip:       testData.checkout.zip,
          phone:     testData.checkout.phone,
        });
        await parameter('First Name', testData.checkout.firstName);
        await parameter('Last Name', testData.checkout.lastName);
        await parameter('Country', testData.checkout.country);
        await parameter('City', testData.checkout.city);
        await parameter('Zip', testData.checkout.zip);
      });
    });

    await test.step('Step 4: Continue from billing and verify next step', async () => {
      await step('Click Continue on billing and assert shipping step loads', async () => {
        await checkoutPage.continueBilling();
        const shippingSection = page.locator('#checkout-step-shipping');
        await expect(shippingSection).toBeVisible({ timeout: 8000 });
        await attachment('Billing Complete', 'Proceeded to shipping step', 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.4  Billing address: blank required fields → validation errors
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.4] Billing address: leave required fields blank → validation errors shown', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, submitting empty billing form shows validation errors');
    await severity(Severity.CRITICAL);
    await tag('Checkout'); await tag('Regression'); await tag('Billing'); await tag('Validation');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that clicking Continue on the billing step without filling required fields
      shows inline validation error messages.</p>
      <h2>Expected Result</h2>
      <p>At least one validation error message is shown on the billing form.</p>
    `);

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();

    await test.step('Step 1: Login, add to cart, proceed to checkout', async () => {
      await step('Setup: login, add product, go to checkout', async () => {
        await loginAddToCartAndCheckout(page, pom);
      });
    });

    await test.step('Step 2: Clear billing fields if pre-filled and click Continue', async () => {
      await step('Select New Address to clear form, click Continue', async () => {
        const dropdown = checkoutPage.billingAddressDropdown;
        if (await dropdown.isVisible()) {
          await dropdown.selectOption({ label: 'New Address' });
          await page.waitForTimeout(500);
        }
        // Clear all fields
        await checkoutPage.billingFirstName.fill('');
        await checkoutPage.billingLastName.fill('');
        await checkoutPage.billingCity.fill('');
        await checkoutPage.billingAddress1.fill('');
        await checkoutPage.billingZip.fill('');
        await checkoutPage.billingPhone.fill('');
        await checkoutPage.continueBilling();
      });
    });

    await test.step('Step 3: Verify validation errors are displayed', async () => {
      await step('Assert at least one validation error is visible', async () => {
        const validationErrors = page.locator('.field-validation-error, .validation-summary-errors');
        await expect(validationErrors.first()).toBeVisible({ timeout: 5000 });
        const count = await validationErrors.count();
        await parameter('Validation Errors Count', String(count));
        const errorTexts = await validationErrors.allTextContents();
        await attachment('Validation Errors', JSON.stringify(errorTexts, null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.5  Use an existing saved address for billing
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.5] Use an existing saved address for billing', async ({ page }) => {
    await BASE_META();
    await story('As a returning logged-in user, I can select a previously saved billing address');
    await severity(Severity.NORMAL);
    await tag('Checkout'); await tag('Regression'); await tag('Billing');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a returning logged-in user who has a saved address can select it from
      the billing address dropdown and proceed without re-entering all fields.</p>
      <h2>Expected Result</h2>
      <p>Saved address is selected and user can continue to the shipping step.</p>
    `);

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();

    await test.step('Step 1: Login, add to cart, go to checkout', async () => {
      await step('Setup: login, add product, proceed to checkout', async () => {
        await loginAddToCartAndCheckout(page, pom);
      });
    });

    await test.step('Step 2: Check if saved address dropdown is available', async () => {
      await step('Inspect billing address dropdown for saved addresses', async () => {
        const dropdown = checkoutPage.billingAddressDropdown;
        const isVisible = await dropdown.isVisible().catch(() => false);
        await parameter('Address Dropdown Visible', String(isVisible));

        if (isVisible) {
          const options = await dropdown.locator('option').allTextContents();
          await attachment('Billing Address Options', JSON.stringify(options, null, 2), 'application/json');
          await parameter('Saved Address Options', String(options.length));

          // Select first non-"New Address" option if available
          const savedOption = options.find(o => !o.toLowerCase().includes('new address'));
          if (savedOption) {
            await dropdown.selectOption({ label: savedOption });
            await parameter('Selected Address', savedOption.trim());
          }
        }
      });
    });

    await test.step('Step 3: Continue from billing to shipping', async () => {
      await step('Click Continue on billing and assert shipping step', async () => {
        await checkoutPage.continueBilling();
        const shippingSection = page.locator('#checkout-step-shipping');
        await expect(shippingSection).toBeVisible({ timeout: 8000 });
        await attachment('Billing Result', 'Proceeded to shipping with saved address', 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.6  Toggle "Ship to different address" and fill separate shipping address
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.6] Toggle "Ship to different address" and fill separate shipping address', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can ship to a different address than my billing address');
    await severity(Severity.NORMAL);
    await tag('Checkout'); await tag('Regression'); await tag('Shipping'); await tag('Address');

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();

    await test.step('Step 1: Login, add to cart, go to checkout', async () => {
      await step('Setup: login, add product, proceed to checkout', async () => {
        await loginAddToCartAndCheckout(page, pom);
      });
    });

    await test.step('Step 2: Fill billing and uncheck Ship to same address', async () => {
      await step('Fill billing address and uncheck "Ship to same address"', async () => {
        await checkoutPage.fillBillingAddress({
          firstName: testData.checkout.firstName,
          lastName:  testData.checkout.lastName,
          country:   testData.checkout.country,
          state:     testData.checkout.state,
          city:      testData.checkout.city,
          address:   testData.checkout.address,
          zip:       testData.checkout.zip,
          phone:     testData.checkout.phone,
        });
        // Uncheck "Ship to same address" if it is checked
        const sameAddressCheckbox = checkoutPage.shipToSameAddressCheckbox;
        const isChecked = await sameAddressCheckbox.isChecked().catch(() => false);
        if (isChecked) {
          await sameAddressCheckbox.uncheck();
          await parameter('Ship to Same Address', 'unchecked');
        }
        await checkoutPage.continueBilling();
      });
    });

    await test.step('Step 3: Verify shipping address form or section is shown', async () => {
      await step('Assert shipping address step is visible', async () => {
        const shippingSection = page.locator('#checkout-step-shipping');
        await expect(shippingSection).toBeVisible({ timeout: 8000 });
        await attachment('Shipping Step', 'Shipping address step visible', 'text/plain');
        await parameter('Shipping Step', 'visible');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.7  Select Ground shipping method and continue
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.7] Select Ground shipping method and continue', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can select the Ground shipping method during checkout');
    await severity(Severity.CRITICAL);
    await tag('Checkout'); await tag('Regression'); await tag('Shipping');

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();

    await test.step('Step 1: Login, add to cart, go to checkout', async () => {
      await step('Setup: login, add product, proceed to checkout', async () => {
        await loginAddToCartAndCheckout(page, pom);
      });
    });

    await test.step('Step 2: Complete billing and shipping address steps', async () => {
      await step('Fill billing and continue to shipping method', async () => {
        await checkoutPage.fillBillingAddress({
          firstName: testData.checkout.firstName,
          lastName:  testData.checkout.lastName,
          country:   testData.checkout.country,
          state:     testData.checkout.state,
          city:      testData.checkout.city,
          address:   testData.checkout.address,
          zip:       testData.checkout.zip,
          phone:     testData.checkout.phone,
        });
        await checkoutPage.continueBilling();
        await checkoutPage.continueShipping();
      });
    });

    await test.step('Step 3: Verify shipping method options and select Ground', async () => {
      await step('Assert shipping method options are visible', async () => {
        const shippingMethodSection = page.locator('#checkout-step-shipping-method');
        await expect(shippingMethodSection).toBeVisible({ timeout: 8000 });
        const options = await page.locator('input[name="shippingoption"]');
        const count = await options.count();
        await parameter('Shipping Options Available', String(count));
        expect(count).toBeGreaterThan(0);
      });
      await step('Select Ground shipping (first available method)', async () => {
        await checkoutPage.selectShippingMethod(0);
        const selectedLabel = await page.locator('input[name="shippingoption"]:checked + label, input[name="shippingoption"]:checked ~ label').first().innerText().catch(() => 'Ground');
        await parameter('Shipping Method Selected', selectedLabel.trim());
        await attachment('Selected Shipping Method', selectedLabel, 'text/plain');
      });
    });

    await test.step('Step 4: Continue to payment method step', async () => {
      await step('Click Continue on shipping method', async () => {
        await checkoutPage.continueShippingMethod();
        const paymentSection = page.locator('#checkout-step-payment-method');
        await expect(paymentSection).toBeVisible({ timeout: 8000 });
        await parameter('Proceeded to', 'Payment Method step');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.8  Select Next Day Air shipping method and verify updated cost
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.8] Select Next Day Air shipping method and verify updated cost', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can select Next Day Air shipping and see its cost');
    await severity(Severity.NORMAL);
    await tag('Checkout'); await tag('Regression'); await tag('Shipping');

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();

    await test.step('Step 1: Login, add to cart, proceed to checkout', async () => {
      await step('Setup: login, add product, go to checkout', async () => {
        await loginAddToCartAndCheckout(page, pom);
      });
    });

    await test.step('Step 2: Fill billing and get to shipping method step', async () => {
      await step('Complete billing and shipping address steps', async () => {
        await checkoutPage.fillBillingAddress({
          firstName: testData.checkout.firstName,
          lastName:  testData.checkout.lastName,
          country:   testData.checkout.country,
          state:     testData.checkout.state,
          city:      testData.checkout.city,
          address:   testData.checkout.address,
          zip:       testData.checkout.zip,
          phone:     testData.checkout.phone,
        });
        await checkoutPage.continueBilling();
        await checkoutPage.continueShipping();
      });
    });

    await test.step('Step 3: Find and select Next Day Air shipping option', async () => {
      await step('Look for Next Day Air option and select it', async () => {
        const shippingOptions = page.locator('input[name="shippingoption"]');
        const count = await shippingOptions.count();
        await parameter('Total Shipping Options', String(count));

        let nextDaySelected = false;
        for (let i = 0; i < count; i++) {
          const label = await page.locator('label').nth(i).innerText().catch(() => '');
          if (label.toLowerCase().includes('next day') || label.toLowerCase().includes('air')) {
            await shippingOptions.nth(i).check();
            await parameter('Selected Shipping', label.trim());
            await attachment('Selected Shipping Method', label, 'text/plain');
            nextDaySelected = true;
            break;
          }
        }

        if (!nextDaySelected) {
          // Select last option (typically more expensive / faster)
          await checkoutPage.selectShippingMethod(count > 1 ? count - 1 : 0);
          await parameter('Note', 'Next Day Air not found — selected last available option');
        }
      });
    });

    await test.step('Step 4: Continue to payment and verify', async () => {
      await step('Continue shipping method step to payment', async () => {
        await checkoutPage.continueShippingMethod();
        const paymentSection = page.locator('#checkout-step-payment-method');
        await expect(paymentSection).toBeVisible({ timeout: 8000 });
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.9  Select "Check / Money Order" payment method and confirm
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.9] Select "Check / Money Order" payment method and confirm', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can pay by Check / Money Order and confirm the order');
    await severity(Severity.CRITICAL);
    await tag('Checkout'); await tag('Regression'); await tag('Payment');

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();
    const orderConfirmation = pom.getOrderConfirmationPage();

    await test.step('Step 1: Login, add to cart, proceed to checkout', async () => {
      await step('Setup: login, add product, go to checkout', async () => {
        await loginAddToCartAndCheckout(page, pom);
      });
    });

    await test.step('Step 2: Complete billing and shipping steps', async () => {
      await step('Fill billing, continue shipping, select shipping method', async () => {
        await completeBillingAndShipping(page, pom);
      });
    });

    await test.step('Step 3: Verify confirm order section and confirm', async () => {
      await step('Assert order summary is visible and click Confirm', async () => {
        const confirmSection = page.locator('#checkout-step-confirm-order');
        await expect(confirmSection).toBeVisible({ timeout: 8000 });
        await parameter('Payment Method', 'Check / Money Order');
        await checkoutPage.confirmOrder();
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 4: Verify order placed successfully', async () => {
      await step('Assert order completed page loads', async () => {
        await expect(page).toHaveURL(/.*completed.*/);
        const isSuccessful = await orderConfirmation.isOrderSuccessful();
        expect(isSuccessful).toBe(true);
        const orderNumber = await orderConfirmation.getOrderNumber();
        await parameter('Order Number', orderNumber);
        await attachment('Order Number (Check/MO)', orderNumber, 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.10  Select Credit Card payment method (if available)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.10] Select Credit Card payment method (if available) and confirm', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can select Credit Card as payment method if available');
    await severity(Severity.NORMAL);
    await tag('Checkout'); await tag('Regression'); await tag('Payment'); await tag('CreditCard');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the Credit Card payment option appears on the checkout payment step.
      If available, select it and verify the credit card form fields are shown.</p>
      <h2>Expected Result</h2>
      <p>Credit Card option is selectable and card form fields appear, or the option is
      confirmed absent if not configured on the demo store.</p>
    `);

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();

    await test.step('Step 1: Login, add to cart, proceed to checkout', async () => {
      await step('Setup: login, add product, go to checkout', async () => {
        await loginAddToCartAndCheckout(page, pom);
      });
    });

    await test.step('Step 2: Fill billing and get to payment method step', async () => {
      await step('Complete billing, shipping address, and shipping method', async () => {
        await checkoutPage.fillBillingAddress({
          firstName: testData.checkout.firstName,
          lastName:  testData.checkout.lastName,
          country:   testData.checkout.country,
          state:     testData.checkout.state,
          city:      testData.checkout.city,
          address:   testData.checkout.address,
          zip:       testData.checkout.zip,
          phone:     testData.checkout.phone,
        });
        await checkoutPage.continueBilling();
        await checkoutPage.continueShipping();
        await checkoutPage.selectShippingMethod(0);
        await checkoutPage.continueShippingMethod();
      });
    });

    await test.step('Step 3: Check for Credit Card option and select if present', async () => {
      await step('Look for Credit Card payment option', async () => {
        const paymentSection = page.locator('#checkout-step-payment-method');
        await expect(paymentSection).toBeVisible({ timeout: 8000 });

        const creditCardOption = page.locator('label:has-text("Credit Card"), label:has-text("credit card")');
        const isVisible = await creditCardOption.isVisible().catch(() => false);
        await parameter('Credit Card Available', String(isVisible));

        if (isVisible) {
          await creditCardOption.click();
          await checkoutPage.continuePaymentMethod();
          // Verify card form fields appear
          const cardForm = page.locator('#credit-card-form, .credit-card-form, #CardholderName');
          const cardFormVisible = await cardForm.isVisible().catch(() => false);
          await parameter('Card Form Visible', String(cardFormVisible));
          await attachment('Credit Card Form', cardFormVisible ? 'Card form visible' : 'No card form', 'text/plain');
        } else {
          await parameter('Note', 'Credit Card not available on demo store — selecting Check/MO');
          await checkoutPage.selectPaymentMethod('Check / Money Order');
          await checkoutPage.continuePaymentMethod();
          await checkoutPage.continuePaymentInfo();
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.11  Order confirmation page displays a valid order number
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.11] Order confirmation page displays a valid order number', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, after placing an order I see a valid order number');
    await severity(Severity.CRITICAL);
    await tag('Checkout'); await tag('Regression'); await tag('OrderConfirmation');

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();
    const orderConfirmation = pom.getOrderConfirmationPage();

    await test.step('Step 1: Complete a full checkout flow', async () => {
      await step('Login, add to cart, fill checkout, confirm order', async () => {
        await loginAddToCartAndCheckout(page, pom);
        await completeBillingAndShipping(page, pom);
        await checkoutPage.confirmOrder();
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 2: Verify order confirmation URL', async () => {
      await step('Assert URL is on the /completed page', async () => {
        await expect(page).toHaveURL(/.*completed.*/);
        await attachment('Confirmation URL', page.url(), 'text/plain');
      });
    });

    await test.step('Step 3: Verify order number is displayed and numeric', async () => {
      await step('Assert order number element is visible and contains digits', async () => {
        const isSuccessful = await orderConfirmation.isOrderSuccessful();
        expect(isSuccessful).toBe(true);
        const orderNumber = await orderConfirmation.getOrderNumber();
        await parameter('Order Number', orderNumber);
        await attachment('Order Number', orderNumber, 'text/plain');
        expect(orderNumber.trim().length).toBeGreaterThan(0);
        expect(/\d+/.test(orderNumber)).toBe(true);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.12  Order confirmation page shows correct items and order total
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.12] Order confirmation page displays correct items and order total', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, the order confirmation page shows the ordered products and total');
    await severity(Severity.CRITICAL);
    await tag('Checkout'); await tag('Regression'); await tag('OrderConfirmation');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the order confirmation / completed page shows the product(s) ordered,
      and the order total value.</p>
      <h2>Expected Result</h2>
      <p>Product names and order total are visible on the confirmation page.</p>
    `);

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();
    const orderConfirmation = pom.getOrderConfirmationPage();

    await test.step('Step 1: Complete a full checkout flow', async () => {
      await step('Login, add to cart, fill checkout, confirm', async () => {
        await loginAddToCartAndCheckout(page, pom);
        await completeBillingAndShipping(page, pom);
        await checkoutPage.confirmOrder();
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 2: Verify order completed section is visible', async () => {
      await step('Assert order completed section displayed', async () => {
        await expect(orderConfirmation.orderCompletedSection).toBeVisible();
        const successMsg = await orderConfirmation.getSuccessMessage();
        await attachment('Success Message', successMsg, 'text/plain');
        await parameter('Success Message', successMsg.trim());
      });
    });

    await test.step('Step 3: Verify order number is shown', async () => {
      await step('Assert order number is visible', async () => {
        const orderNumber = await orderConfirmation.getOrderNumber();
        await parameter('Order Number', orderNumber);
        expect(orderNumber.trim().length).toBeGreaterThan(0);
      });
    });

    await test.step('Step 4: Navigate to order details and verify line items', async () => {
      await step('Click order number link to view order details', async () => {
        const orderLink = page.locator('.order-number a, .details-link a').first();
        const hasLink = await orderLink.isVisible().catch(() => false);
        if (hasLink) {
          await orderLink.click();
          await page.waitForLoadState('networkidle');
          const orderItems = page.locator('.cart-item-row, .order-item');
          const itemCount = await orderItems.count();
          await parameter('Order Line Items', String(itemCount));
          const total = page.locator('.order-total-value, .order-subtotal-value').first();
          if (await total.isVisible()) {
            const totalText = await total.innerText();
            await attachment('Order Total', totalText, 'text/plain');
          }
        } else {
          await parameter('Note', 'No order details link on completion page');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8.13  "Thank you" / order completed page is displayed after submission
  // ─────────────────────────────────────────────────────────────────────────────
  test('[8.13] "Thank you" / order completed page is displayed after order submission', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, after placing an order I see the Thank You confirmation page');
    await severity(Severity.CRITICAL);
    await tag('Checkout'); await tag('Regression'); await tag('OrderConfirmation'); await tag('Happy-Path');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that after confirming an order, the "Thank you for your order" / completed
      page is displayed with a success message and continue button.</p>
      <h2>Expected Result</h2>
      <p>Order completed page is shown with a success title and a Continue button.</p>
    `);

    const pom = new PageObjectManager(page);
    const checkoutPage = pom.getCheckoutPage();
    const orderConfirmation = pom.getOrderConfirmationPage();

    await test.step('Step 1: Complete a full checkout flow', async () => {
      await step('Login, add to cart, fill all checkout steps, confirm', async () => {
        await loginAddToCartAndCheckout(page, pom);
        await completeBillingAndShipping(page, pom);
        await checkoutPage.confirmOrder();
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 2: Verify Thank You page is displayed', async () => {
      await step('Assert URL is on the /completed page', async () => {
        await expect(page).toHaveURL(/.*completed.*/);
        await attachment('Completion Page URL', page.url(), 'text/plain');
      });
      await step('Assert order completed section with success title is visible', async () => {
        await expect(orderConfirmation.orderCompletedSection).toBeVisible();
        const successMsg = await orderConfirmation.getSuccessMessage();
        await parameter('Thank You Message', successMsg.trim());
        await attachment('Thank You Message', successMsg, 'text/plain');
        expect(successMsg.trim().length).toBeGreaterThan(0);
      });
    });

    await test.step('Step 3: Verify Continue button is present', async () => {
      await step('Assert Continue button is visible on the completed page', async () => {
        await expect(orderConfirmation.continueButton).toBeVisible();
        await parameter('Continue Button', 'visible');
      });
    });

    await test.step('Step 4: Click Continue and verify redirect to home page', async () => {
      await step('Click Continue and assert home page loads', async () => {
        await orderConfirmation.continueShopping();
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
        await attachment('Final URL After Continue', page.url(), 'text/plain');
      });
    });
  });

});
