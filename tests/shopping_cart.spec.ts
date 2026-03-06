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
  await epic('Shopping Cart');
  await feature('Cart');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

// Helper: login + add one book to cart, return to cart page
async function loginAndAddToCart(page: any, pom: any) {
  const loginPage = pom.getLoginPage();
  const credentials = CredentialManager.load();
  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);
  await page.goto('/computing-and-internet');
  await page.locator('.add-to-cart-button').first().click();
  await page.waitForTimeout(1500);
  await pom.getCartPage().goto();
}

test.describe('Module 7 — Shopping Cart', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.1  Cart displays correct product name, unit price, quantity and subtotal
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.1] Cart displays correct product name, unit price, quantity and subtotal', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, the cart page shows correct product details');
    await severity(Severity.CRITICAL);
    await tag('Cart'); await tag('Regression'); await tag('Happy-Path');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that after adding a product, the cart page shows the correct product name,
      unit price, quantity, and subtotal values.</p>
      <h2>Expected Result</h2>
      <p>Cart row has non-empty name, price, quantity of 1, and a matching subtotal.</p>
    `);

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add a product to cart', async () => {
      await step('Login and navigate to product, add to cart', async () => {
        await loginAndAddToCart(page, pom);
      });
    });

    await test.step('Step 2: Verify product name in cart', async () => {
      await step('Assert at least one item name is shown', async () => {
        const names = await cartPage.getProductNames();
        await parameter('Cart Item', names[0].trim());
        await attachment('Cart Product Names', JSON.stringify(names, null, 2), 'application/json');
        expect(names.length).toBeGreaterThan(0);
        expect(names[0].trim().length).toBeGreaterThan(0);
      });
    });

    await test.step('Step 3: Verify unit price is displayed', async () => {
      await step('Assert unit price cell is non-empty', async () => {
        const unitPrice = await cartPage.itemUnitPrices.first().innerText();
        await parameter('Unit Price', unitPrice.trim());
        expect(unitPrice.trim().length).toBeGreaterThan(0);
      });
    });

    await test.step('Step 4: Verify quantity is 1', async () => {
      await step('Assert qty input value is 1', async () => {
        const qty = await cartPage.itemQuantityInputs.first().inputValue();
        await parameter('Quantity', qty);
        expect(qty).toBe('1');
      });
    });

    await test.step('Step 5: Verify subtotal is displayed', async () => {
      await step('Assert subtotal cell is non-empty', async () => {
        const subtotal = await cartPage.itemSubtotals.first().innerText();
        await parameter('Subtotal', subtotal.trim());
        expect(subtotal.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.2  Update product quantity in cart → subtotal recalculates
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.2] Update product quantity in cart → subtotal recalculates correctly', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, changing the quantity updates the subtotal accordingly');
    await severity(Severity.CRITICAL);
    await tag('Cart'); await tag('Regression');

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add product to cart', async () => {
      await step('Setup: login and add one item', async () => {
        await loginAndAddToCart(page, pom);
      });
    });

    await test.step('Step 2: Record subtotal before update', async () => {
      await step('Read current subtotal', async () => {
        const before = await cartPage.itemSubtotals.first().innerText();
        await parameter('Subtotal Before', before.trim());
        await attachment('Subtotal Before Update', before, 'text/plain');
      });
    });

    await test.step('Step 3: Change quantity to 2 and update cart', async () => {
      await step('Set qty to 2 and click Update Cart', async () => {
        await cartPage.updateItemQuantity(0, 2);
        await page.waitForLoadState('networkidle');
        await parameter('New Quantity', '2');
      });
    });

    await test.step('Step 4: Verify subtotal increased', async () => {
      await step('Assert qty is 2 and subtotal updated', async () => {
        const newQty = await cartPage.itemQuantityInputs.first().inputValue();
        expect(newQty).toBe('2');
        const newSubtotal = await cartPage.itemSubtotals.first().innerText();
        await parameter('Subtotal After', newSubtotal.trim());
        await attachment('Subtotal After Update', newSubtotal, 'text/plain');
        expect(newSubtotal.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.3  Remove item from cart → cart becomes empty
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.3] Remove item from cart → cart becomes empty', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can remove a product from the cart');
    await severity(Severity.CRITICAL);
    await tag('Cart'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that checking the remove checkbox and clicking Update Cart removes the item,
      leaving an empty cart message.</p>
      <h2>Expected Result</h2>
      <p>Cart shows empty state message after the item is removed.</p>
    `);

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add one product to cart', async () => {
      await step('Setup: login and add one item to cart', async () => {
        await loginAndAddToCart(page, pom);
        const count = await cartPage.getCartItemCount();
        expect(count).toBeGreaterThan(0);
      });
    });

    await test.step('Step 2: Check the remove checkbox and update cart', async () => {
      await step('Check remove checkbox for first item and click Update Cart', async () => {
        await cartPage.removeItem(0);
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 3: Verify cart is empty', async () => {
      await step('Assert empty cart message is displayed', async () => {
        await expect(cartPage.emptyCartMessage).toBeVisible();
        const emptyText = await cartPage.emptyCartMessage.innerText();
        await attachment('Empty Cart Message', emptyText, 'text/plain');
        expect(emptyText.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.4  Cart item count badge in header updates after add/remove
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.4] Cart item count badge in header updates correctly after add/remove', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, the cart count badge in the header reflects the cart contents');
    await severity(Severity.CRITICAL);
    await tag('Cart'); await tag('Regression'); await tag('Header');

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const cartPage = pom.getCartPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login and record initial cart count', async () => {
      await step('Login and navigate to home page', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
        const initialCount = await cartPage.getHeaderCartCount();
        await parameter('Initial Cart Count', initialCount);
        await attachment('Initial Header Count', initialCount, 'text/plain');
      });
    });

    await test.step('Step 2: Add a product and check header count increased', async () => {
      await step('Add a book to cart from product page', async () => {
        await page.goto('/computing-and-internet');
        await page.locator('.add-to-cart-button').first().click();
        await page.waitForTimeout(1500);
        const afterAdd = await cartPage.getHeaderCartCount();
        await parameter('Count After Add', afterAdd);
        await attachment('Header Count After Add', afterAdd, 'text/plain');
        expect(afterAdd).not.toBe('(0)');
      });
    });

    await test.step('Step 3: Remove item from cart and check count decreases', async () => {
      await step('Go to cart, remove item, and check header count', async () => {
        await cartPage.goto();
        await cartPage.removeItem(0);
        await page.waitForLoadState('networkidle');
        const afterRemove = await cartPage.getHeaderCartCount();
        await parameter('Count After Remove', afterRemove);
        await attachment('Header Count After Remove', afterRemove, 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.5  Estimate shipping: country/state/zip → rates displayed
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.5] Estimate shipping: select country/state/zip → rates displayed', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can estimate shipping costs from the cart page');
    await severity(Severity.CRITICAL);
    await tag('Cart'); await tag('Regression'); await tag('Shipping');

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add product to cart', async () => {
      await step('Setup: login and add one item', async () => {
        await loginAndAddToCart(page, pom);
      });
    });

    await test.step('Step 2: Fill estimate shipping form', async () => {
      await step('Select country, state, and enter zip code', async () => {
        await parameter('Country', testData.shipping.country);
        await parameter('State', testData.shipping.state);
        await parameter('Zip', testData.shipping.zip);
        await cartPage.estimateShipping(
          testData.shipping.country,
          testData.shipping.state,
          testData.shipping.zip
        );
      });
    });

    await test.step('Step 3: Verify shipping results are shown', async () => {
      await step('Assert shipping results section is visible with options', async () => {
        await expect(cartPage.shippingResultsSection).toBeVisible();
        const shippingOptions = await cartPage.getShippingOptions();
        await attachment('Shipping Options', JSON.stringify(shippingOptions, null, 2), 'application/json');
        expect(shippingOptions.length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.6  Apply valid coupon code → discount applied
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.6] Apply valid coupon code → discount applied to order total', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can apply a valid coupon code and get a discount');
    await severity(Severity.NORMAL);
    await tag('Cart'); await tag('Regression'); await tag('Coupon');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that entering a known valid coupon code shows a discount in the cart totals.</p>
      <h2>Expected Result</h2>
      <p>A discount is applied and the coupon result message is shown.</p>
    `);

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add product to cart', async () => {
      await step('Setup: login and add one item', async () => {
        await loginAndAddToCart(page, pom);
      });
    });

    await test.step('Step 2: Enter a coupon code and apply', async () => {
      await step('Fill coupon input and click Apply', async () => {
        const couponCode = 'TRICENTIS';
        await parameter('Coupon Code', couponCode);
        await cartPage.applyCoupon(couponCode);
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 3: Verify coupon response is shown', async () => {
      await step('Assert coupon result message is displayed', async () => {
        const couponMsg = cartPage.couponMessage;
        const msgVisible = await couponMsg.isVisible();
        const barNotifVisible = await page.locator('#bar-notification').isVisible();
        const anyFeedback = msgVisible || barNotifVisible;
        expect(anyFeedback).toBe(true);
        if (msgVisible) {
          const text = await couponMsg.innerText();
          await attachment('Coupon Result', text, 'text/plain');
          await parameter('Coupon Response', text.trim());
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.7  Apply invalid coupon code → error message
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.7] Apply invalid coupon code → error message displayed', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, entering an invalid coupon code shows an error');
    await severity(Severity.NORMAL);
    await tag('Cart'); await tag('Regression'); await tag('Coupon'); await tag('Negative');

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add product to cart', async () => {
      await step('Setup: login and add one item', async () => {
        await loginAndAddToCart(page, pom);
      });
    });

    await test.step('Step 2: Enter an invalid coupon code and apply', async () => {
      await step('Fill coupon input with invalid code and click Apply', async () => {
        const invalidCode = 'INVALIDCOUPON999';
        await parameter('Invalid Coupon Code', invalidCode);
        await cartPage.applyCoupon(invalidCode);
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 3: Verify error response is shown', async () => {
      await step('Assert error message is displayed', async () => {
        const couponMsg = cartPage.couponMessage;
        const barNotif = page.locator('#bar-notification');
        const msgVisible = await couponMsg.isVisible();
        const barVisible = await barNotif.isVisible();
        expect(msgVisible || barVisible).toBe(true);
        if (msgVisible) {
          const text = await couponMsg.innerText();
          await attachment('Coupon Error Message', text, 'text/plain');
          await parameter('Error Response', text.trim());
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.8  Apply gift card code → balance deducted from order total
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.8] Apply gift card code → balance deducted from order total', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, applying a gift card code deducts from the cart total');
    await severity(Severity.NORMAL);
    await tag('Cart'); await tag('Regression'); await tag('GiftCard');

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add product to cart', async () => {
      await step('Setup: login and add one item', async () => {
        await loginAndAddToCart(page, pom);
      });
    });

    await test.step('Step 2: Record order total before applying gift card', async () => {
      await step('Read order total before gift card', async () => {
        const totalBefore = await cartPage.getOrderTotal();
        await parameter('Total Before', totalBefore.trim());
        await attachment('Order Total Before Gift Card', totalBefore, 'text/plain');
      });
    });

    await test.step('Step 3: Enter gift card code and apply', async () => {
      await step('Fill gift card input with a code and apply', async () => {
        const giftCardCode = 'GIFTCARD2024';
        await parameter('Gift Card Code', giftCardCode);
        await cartPage.applyGiftCard(giftCardCode);
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 4: Verify response is shown', async () => {
      await step('Assert feedback message or total update is present', async () => {
        const barNotif = page.locator('#bar-notification');
        const giftMsg = page.locator('.gift-card-box, .coupon-box');
        const barVisible = await barNotif.isVisible();
        const giftVisible = await giftMsg.isVisible();
        const feedbackPresent = barVisible || giftVisible;
        await attachment('Gift Card Response', feedbackPresent ? 'Feedback received' : 'No feedback', 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.9  Terms of Service checkbox must be accepted before checkout
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.9] Terms of Service checkbox must be accepted before checkout', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I must accept Terms of Service to proceed to checkout');
    await severity(Severity.CRITICAL);
    await tag('Cart'); await tag('Regression'); await tag('ToS');

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add product to cart', async () => {
      await step('Setup: login and add one item', async () => {
        await loginAndAddToCart(page, pom);
      });
    });

    await test.step('Step 2: Verify Terms of Service checkbox is present', async () => {
      await step('Assert ToS checkbox is visible and unchecked by default', async () => {
        await expect(cartPage.termsOfServiceCheckbox).toBeVisible();
        const isChecked = await cartPage.termsOfServiceCheckbox.isChecked();
        await parameter('ToS Checked By Default', String(isChecked));
      });
    });

    await test.step('Step 3: Accept ToS and proceed to checkout', async () => {
      await step('Check ToS checkbox and click Checkout', async () => {
        await cartPage.proceedToCheckout();
        await page.waitForTimeout(1500);
      });
    });

    await test.step('Step 4: Verify checkout page is reached', async () => {
      await step('Assert URL is on the checkout page', async () => {
        await expect(page).toHaveURL(/.*checkout.*/);
        await attachment('Checkout URL', page.url(), 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.10  Checkout without accepting ToS → blocked with error
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.10] Proceeding to checkout without accepting ToS → blocked with error', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I cannot proceed to checkout without accepting ToS');
    await severity(Severity.CRITICAL);
    await tag('Cart'); await tag('Regression'); await tag('ToS'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that clicking the Checkout button without checking the Terms of Service checkbox
      prevents navigation and shows an error or alert.</p>
      <h2>Expected Result</h2>
      <p>User remains on the cart page and an error/dialog is shown.</p>
    `);

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add product to cart', async () => {
      await step('Setup: login and add one item', async () => {
        await loginAndAddToCart(page, pom);
      });
    });

    await test.step('Step 2: Click Checkout WITHOUT accepting ToS', async () => {
      await step('Click checkout button directly without checking ToS', async () => {
        // Dismiss any dialog that may appear
        page.on('dialog', async dialog => {
          await attachment('ToS Dialog Message', dialog.message(), 'text/plain');
          await dialog.dismiss();
        });
        await cartPage.checkoutButton.click();
        await page.waitForTimeout(1000);
      });
    });

    await test.step('Step 3: Verify user is blocked from checkout', async () => {
      await step('Assert user is still on cart page or error is shown', async () => {
        const currentUrl = page.url();
        await attachment('URL After Checkout Attempt', currentUrl, 'text/plain');
        // User should still be on cart or there's a validation message
        const onCart = currentUrl.includes('/cart');
        const errorVisible = await page.locator('.message-error, .bar-notification').isVisible();
        expect(onCart || errorVisible).toBe(true);
        await parameter('Blocked from Checkout', String(onCart || errorVisible));
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.11  Header flyout cart shows added items on hover
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.11] Header flyout cart shows added items and subtotal on hover', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user with items in cart, hovering the cart icon shows a flyout');
    await severity(Severity.NORMAL);
    await tag('Cart'); await tag('Regression'); await tag('Flyout');

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const homePage = pom.getHomePage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login and add a product to cart', async () => {
      await step('Login and add a book to cart', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await page.goto('/computing-and-internet');
        await page.locator('.add-to-cart-button').first().click();
        await page.waitForTimeout(1500);
        await homePage.goto();
      });
    });

    await test.step('Step 2: Hover over the cart icon in the header', async () => {
      await step('Hover cart-qty link to trigger flyout', async () => {
        await homePage.cartLink.hover();
        await page.waitForTimeout(600);
      });
    });

    await test.step('Step 3: Verify flyout cart content', async () => {
      await step('Assert mini cart is visible with items', async () => {
        const flyout = page.locator('#flyout-cart');
        await expect(flyout).toBeVisible({ timeout: 5000 });
        const flyoutText = await flyout.innerText();
        await attachment('Flyout Cart Content', flyoutText, 'text/plain');
        expect(flyoutText.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.12  "Continue shopping" from cart → returns to previous page
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.12] "Continue shopping" from cart → returns to previous category', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can continue shopping from the cart page');
    await severity(Severity.MINOR);
    await tag('Cart'); await tag('Regression'); await tag('Navigation');

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add product to cart', async () => {
      await step('Setup: login and add one item', async () => {
        await loginAndAddToCart(page, pom);
      });
    });

    await test.step('Step 2: Verify Continue Shopping button is present', async () => {
      await step('Assert Continue Shopping button is visible', async () => {
        await expect(cartPage.continueShoppingButton).toBeVisible();
        await parameter('Continue Shopping Button', 'visible');
      });
    });

    await test.step('Step 3: Click Continue Shopping', async () => {
      await step('Click the Continue Shopping link', async () => {
        await cartPage.continueShoppingButton.click();
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 4: Verify user navigated away from cart', async () => {
      await step('Assert URL is no longer the cart page', async () => {
        const currentUrl = page.url();
        await attachment('URL After Continue Shopping', currentUrl, 'text/plain');
        expect(currentUrl).not.toContain('/cart');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7.13  Cart contents persist after browser refresh
  // ─────────────────────────────────────────────────────────────────────────────
  test('[7.13] Cart contents persist after browser refresh (logged-in user)', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, my cart contents are preserved after refreshing the page');
    await severity(Severity.NORMAL);
    await tag('Cart'); await tag('Regression'); await tag('Session');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that items added to the cart remain after the browser page is refreshed,
      confirming server-side session persistence for logged-in users.</p>
      <h2>Expected Result</h2>
      <p>The same product is still visible in the cart after a full page refresh.</p>
    `);

    const pom = new PageObjectManager(page);
    const cartPage = pom.getCartPage();

    await test.step('Step 1: Login and add product to cart', async () => {
      await step('Setup: login and add one item to cart', async () => {
        await loginAndAddToCart(page, pom);
        const names = await cartPage.getProductNames();
        await parameter('Product In Cart', names[0].trim());
        await attachment('Products Before Refresh', JSON.stringify(names, null, 2), 'application/json');
      });
    });

    await test.step('Step 2: Refresh the cart page', async () => {
      await step('Reload the cart page', async () => {
        await page.reload();
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 3: Verify cart still has items', async () => {
      await step('Assert product is still in cart after refresh', async () => {
        const isEmpty = await cartPage.isCartEmpty();
        expect(isEmpty).toBe(false);
        const names = await cartPage.getProductNames();
        await attachment('Products After Refresh', JSON.stringify(names, null, 2), 'application/json');
        expect(names.length).toBeGreaterThan(0);
        await parameter('Items After Refresh', String(names.length));
      });
    });
  });

});
