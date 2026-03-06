import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import { CredentialManager } from '../utils/CredentialManager';
import testData from '../utils/testdata.json';

test('E2E: Register → Login → Search → Add to Cart → Checkout → Order Confirmation', async ({ page }) => {

  // ─── Allure Report Metadata ───────────────────────────────────────────────
  await epic('E2E Purchase Flow');
  await feature('Shop & Checkout');
  await story('As a new user, I register, search for a book, add it to cart, and complete checkout');
  await severity(Severity.CRITICAL);
  await owner('QA Team');
  await tag('E2E');
  await tag('Regression');
  await tag('Purchase');
  await tag('Checkout');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');

  await descriptionHtml(`
    <h2>Test Objective</h2>
    <p>
      Verify the complete <strong>end-to-end purchase flow</strong> on the Tricentis Demo Web Shop —
      from user registration through product search, cart management, shipping estimation, and order confirmation.
    </p>

    <h2>Pre-conditions</h2>
    <ul>
      <li>Application is accessible at <a href="https://demowebshop.tricentis.com">https://demowebshop.tricentis.com</a></li>
      <li>A unique email is generated per test run to avoid duplicate registration</li>
      <li>Test data is loaded from <code>utils/testdata.json</code></li>
    </ul>

    <h2>Test Steps</h2>
    <ol>
      <li>Register a new user and save credentials</li>
      <li>Login with saved credentials</li>
      <li>Search for a book: <em>"Computing and Internet"</em></li>
      <li>Add the book to the shopping cart</li>
      <li>Verify the "added to cart" notification bar</li>
      <li>Verify shopping cart count in header</li>
      <li>Navigate to the shopping cart page</li>
      <li>Verify the correct book is in the cart</li>
      <li>Estimate shipping (country, state, zip)</li>
      <li>Verify shipping options are displayed</li>
      <li>Accept terms of service and proceed to checkout</li>
      <li>Fill billing address details</li>
      <li>Select shipping method and payment method</li>
      <li>Confirm order</li>
      <li>Verify Thank You page and order number</li>
    </ol>

    <h2>Expected Result</h2>
    <p>
      The user successfully completes the full purchase cycle. The order confirmation page
      displays a <strong>success message</strong> and a unique <strong>order number</strong>.
    </p>
  `);

  // ─── Setup ────────────────────────────────────────────────────────────────
  const pom = new PageObjectManager(page);
  const registerPage = pom.getRegisterPage();
  const loginPage = pom.getLoginPage();
  const homePage = pom.getHomePage();
  const searchResultsPage = pom.getSearchResultsPage();
  const productPage = pom.getProductPage();
  const cartPage = pom.getCartPage();
  const checkoutPage = pom.getCheckoutPage();
  const orderConfirmationPage = pom.getOrderConfirmationPage();

  const uniqueEmail = `${testData.newUser.emailPrefix}+${Date.now()}@test.com`;
  const password = testData.newUser.password;

  await attachment(
    'Test Input Data',
    JSON.stringify({
      firstName: testData.newUser.firstName,
      lastName: testData.newUser.lastName,
      email: uniqueEmail,
      searchTerm: testData.search.term,
      expectedBook: testData.search.expectedBook,
      shippingCountry: testData.shipping.country,
      shippingState: testData.shipping.state,
      shippingZip: testData.shipping.zip,
    }, null, 2),
    'application/json'
  );

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1: Register a new user
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 1: Register a new user', async () => {

    await step('Navigate to the Registration page', async () => {
      await registerPage.goto();
      await expect(page).toHaveURL(/.*register/);
    });

    await step('Fill in registration details', async () => {
      await parameter('First Name', testData.newUser.firstName);
      await parameter('Last Name', testData.newUser.lastName);
      await parameter('Email', uniqueEmail);
      await parameter('Password', '***hidden***');
    });

    await step('Submit registration form and verify success', async () => {
      await registerPage.register(
        testData.newUser.gender as 'male' | 'female',
        testData.newUser.firstName,
        testData.newUser.lastName,
        uniqueEmail,
        password
      );
      const result = await registerPage.getRegistrationResult();
      expect(result).toContain('Your registration completed');
      await attachment('Registration Result', result, 'text/plain');
    });

    await step('Save registered credentials to credentials.json', async () => {
      CredentialManager.save({ email: uniqueEmail, password });
      await attachment(
        'Saved Credentials',
        JSON.stringify({ email: uniqueEmail, password: '***hidden***' }, null, 2),
        'application/json'
      );
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2: Login with saved credentials
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 2: Login with saved credentials', async () => {

    await step('Navigate to Login page', async () => {
      await loginPage.goto();
      await expect(page).toHaveURL(/.*login/);
    });

    await step('Enter credentials and submit login form', async () => {
      const credentials = CredentialManager.load();
      await parameter('Login Email', credentials.email);
      await loginPage.login(credentials.email, credentials.password);
    });

    await step('Verify user is logged in', async () => {
      await expect(page.locator('.account').first()).toBeVisible();
      await expect(page.locator('.ico-logout')).toBeVisible();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 3: Search for a book
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 3: Search for a book', async () => {

    await step(`Search for "${testData.search.term}" using the header search box`, async () => {
      await parameter('Search Term', testData.search.term);
      await homePage.search(testData.search.term);
    });

    await step('Verify search results page loaded with results', async () => {
      await expect(page).toHaveURL(/.*search/);
      const hasResults = await searchResultsPage.hasResults();
      expect(hasResults).toBeTruthy();
      const productNames = await searchResultsPage.getProductNames();
      await attachment('Search Results', productNames.join('\n'), 'text/plain');
    });

    await step(`Verify "${testData.search.expectedBook}" appears in results`, async () => {
      const productNames = await searchResultsPage.getProductNames();
      const found = productNames.some(name =>
        name.toLowerCase().includes(testData.search.expectedBook.toLowerCase())
      );
      expect(found, `Book "${testData.search.expectedBook}" should appear in search results`).toBeTruthy();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 4: Navigate to product and add to cart
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 4: Open the book and add it to the cart', async () => {

    await step(`Click on "${testData.search.expectedBook}" to open product page`, async () => {
      await searchResultsPage.clickProduct(testData.search.expectedBook);
      await expect(page).not.toHaveURL(/.*search/);
    });

    await step('Click "Add to cart" button on product page', async () => {
      await productPage.addToCart();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 5: Verify "added to cart" notification
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 5: Verify "added to cart" notification bar', async () => {

    await step('Wait for and read the bar notification message', async () => {
      const notificationText = await productPage.getBarNotificationText();
      await attachment('Bar Notification Text', notificationText, 'text/plain');
      expect(notificationText.toLowerCase()).toContain('added to your shopping cart');
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 6: Verify cart count in header
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 6: Verify shopping cart count in the header', async () => {

    await step('Read the cart count from the header link', async () => {
      const cartCountText = await page.locator('.cart-qty').innerText();
      await attachment('Cart Count Text', cartCountText, 'text/plain');
      expect(cartCountText).toContain('1');
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 7: Navigate to shopping cart
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 7: Navigate to the shopping cart', async () => {

    await step('Click the cart link in the header', async () => {
      await page.locator('.cart-qty').click();
      await expect(page).toHaveURL(/.*cart/);
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 8: Verify correct book is in the cart
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 8: Verify the correct book is in the cart', async () => {

    await step('Read product names from cart table', async () => {
      const cartProducts = await cartPage.getProductNames();
      await attachment('Cart Products', cartProducts.join('\n'), 'text/plain');
      const bookInCart = cartProducts.some(name =>
        name.toLowerCase().includes(testData.search.expectedBook.toLowerCase())
      );
      expect(bookInCart, `"${testData.search.expectedBook}" should be present in the cart`).toBeTruthy();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 9: Estimate shipping
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 9: Estimate shipping cost', async () => {

    await step('Select country, state and enter zip code', async () => {
      await parameter('Country', testData.shipping.country);
      await parameter('State', testData.shipping.state);
      await parameter('Zip Code', testData.shipping.zip);
    });

    await step('Click "Estimate shipping" and wait for results', async () => {
      await cartPage.estimateShipping(
        testData.shipping.country,
        testData.shipping.state,
        testData.shipping.zip
      );
    });

    await step('Verify shipping options are displayed', async () => {
      await expect(cartPage.shippingResultsSection).toBeVisible();
      const shippingOptions = await cartPage.getShippingOptions();
      expect(shippingOptions.length).toBeGreaterThan(0);
      await attachment('Shipping Options', shippingOptions.join('\n'), 'text/plain');
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 10: Accept terms and proceed to checkout
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 10: Accept terms of service and proceed to checkout', async () => {

    await step('Check the "Terms of Service" checkbox', async () => {
      await cartPage.termsOfServiceCheckbox.check();
      await expect(cartPage.termsOfServiceCheckbox).toBeChecked();
    });

    await step('Click the "Checkout" button', async () => {
      await cartPage.checkoutButton.click();
      await expect(page).toHaveURL(/.*checkout/);
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 11: Fill billing address
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 11: Fill in billing address details', async () => {

    await step('Enter billing address form fields', async () => {
      await parameter('First Name', testData.checkout.firstName);
      await parameter('Last Name', testData.checkout.lastName);
      await parameter('City', testData.checkout.city);
      await parameter('Address', testData.checkout.address);
      await parameter('Zip', testData.checkout.zip);
      await parameter('Phone', testData.checkout.phone);

      await checkoutPage.fillBillingAddress({
        firstName: testData.checkout.firstName,
        lastName: testData.checkout.lastName,
        country: testData.checkout.country,
        state: testData.checkout.state,
        city: testData.checkout.city,
        address: testData.checkout.address,
        zip: testData.checkout.zip,
        phone: testData.checkout.phone,
      });
    });

    await step('Click "Continue" on billing step', async () => {
      await checkoutPage.continueBilling();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 12: Shipping address step
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 12: Confirm shipping address (same as billing)', async () => {

    await step('Click "Continue" on shipping address step', async () => {
      await checkoutPage.continueShipping();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 13: Select shipping method
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 13: Select shipping method', async () => {

    await step('Select the first available shipping method', async () => {
      await checkoutPage.selectShippingMethod(0);
    });

    await step('Click "Continue" on shipping method step', async () => {
      await checkoutPage.continueShippingMethod();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 14: Select payment method
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 14: Select payment method', async () => {

    await step('Select "Check / Money Order" payment method', async () => {
      await checkoutPage.selectPaymentMethod('Check / Money Order');
    });

    await step('Click "Continue" on payment method step', async () => {
      await checkoutPage.continuePaymentMethod();
    });

    await step('Continue through payment info step (if visible)', async () => {
      await checkoutPage.continuePaymentInfo();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 15: Confirm order
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 15: Confirm the order', async () => {

    await step('Click "Confirm" to place the order', async () => {
      await checkoutPage.confirmOrder();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 16: Verify Thank You / Order Confirmation page
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 16: Verify order confirmation page', async () => {

    await step('Verify URL is the order completed page', async () => {
      await expect(page).toHaveURL(/.*completed/);
    });

    await step('Verify the order success message is displayed', async () => {
      const isSuccessful = await orderConfirmationPage.isOrderSuccessful();
      expect(isSuccessful, 'Order completed section should be visible').toBeTruthy();
    });

    await step('Verify and capture the order number', async () => {
      const orderNumber = await orderConfirmationPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
      expect(orderNumber.trim().length).toBeGreaterThan(0);
      await attachment('Order Number', orderNumber, 'text/plain');
      await parameter('Order Number', orderNumber);
    });

  });

});
