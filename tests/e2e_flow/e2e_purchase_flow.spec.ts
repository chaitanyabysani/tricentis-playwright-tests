import { test, expect } from '@playwright/test';
//import {
  //epic, feature, story, severity, owner, tag, link,
  //descriptionHtml, parameter, attachment, step
//} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../../pageobjects/PageObjectManager';
import { CredentialManager } from '../../utils/CredentialManager';
import testData from '../../utils/testdata.json';
import * as allure from 'allure-js-commons';

test('E2E: Register → Login → Search → Add to Cart → Checkout → Order Confirmation', async ({ page }) => {

  // ─── Allure Report Metadata ───────────────────────────────────────────────
  await allure.epic('E2E Purchase Flow');
  await allure.feature('Shop & Checkout');
  await allure.story('As a new user, I register, search for a book, add it to cart, and complete checkout');
  await allure.severity(Severity.CRITICAL);
  await allure.owner('QA Team');
  await allure.tag('E2E');
  await allure.tag('Regression');
  await allure.tag('Purchase');
  await allure.tag('Checkout');
  await allure.link('https://demowebshop.tricentis.com', 'Application Under Test');

  await allure.descriptionHtml(`
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

  // ─── Step 0: Log test input data ─────────────────────────────────────────
  await test.step('Step 0: Log test input data', async () => {
    await allure.step('Attach test input payload', async () => {
      await allure.attachment(
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
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1: Register a new user
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 1: Register a new user', async () => {

    await allure.step('Navigate to the Registration page', async () => {
      await registerPage.goto();
      await expect(page).toHaveURL(/.*register/);
    });

    await allure.step('Fill registration form and submit', async () => {
      await allure.parameter('First Name', testData.newUser.firstName);
      await allure.parameter('Last Name', testData.newUser.lastName);
      await allure.parameter('Email', uniqueEmail);
      await allure.parameter('Password', '***hidden***');
      await registerPage.register(
        testData.newUser.gender as 'male' | 'female',
        testData.newUser.firstName,
        testData.newUser.lastName,
        uniqueEmail,
        password
      );
    });

    await allure.step('Verify registration success', async () => {
      const result = await registerPage.getRegistrationResult();
      expect(result).toContain('Your registration completed');
      await allure.attachment('Registration Result', result, 'text/plain');
    });

    await allure.step('Save registered credentials to credentials.json', async () => {
      CredentialManager.save({ email: uniqueEmail, password });
      await allure.attachment(
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

    await allure.step('Navigate to Login page', async () => {
      await loginPage.goto();
      await expect(page).toHaveURL(/.*login/);
    });

    await allure.step('Enter credentials and submit login form', async () => {
      const credentials = CredentialManager.load();
      await allure.parameter('Login Email', credentials.email);
      await loginPage.login(credentials.email, credentials.password);
    });

    await allure.step('Verify user is logged in', async () => {
      await expect(page.locator('.account').first()).toBeVisible();
      await expect(page.locator('.ico-logout')).toBeVisible();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 3: Search for a book
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 3: Search for a book', async () => {

    await allure.step(`Search for "${testData.search.term}" using the header search box`, async () => {
      await allure.parameter('Search Term', testData.search.term);
      await homePage.search(testData.search.term);
    });

    await allure.step('Verify search results page loaded with results', async () => {
      await expect(page).toHaveURL(/.*search/);
      const hasResults = await searchResultsPage.hasResults();
      expect(hasResults).toBeTruthy();
      const productNames = await searchResultsPage.getProductNames();
      await allure.attachment('Search Results', productNames.join('\n'), 'text/plain');
    });

    await allure.step(`Verify "${testData.search.expectedBook}" appears in results`, async () => {
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

    await allure.step(`Click on "${testData.search.expectedBook}" to open product page`, async () => {
      await searchResultsPage.clickProduct(testData.search.expectedBook);
      await expect(page).not.toHaveURL(/.*search/);
    });

    await allure.step('Click "Add to cart" button on product page', async () => {
      await productPage.addToCart();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 5: Verify "added to cart" notification
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 5: Verify "added to cart" notification bar', async () => {

    await allure.step('Wait for and read the bar notification message', async () => {
      const notificationText = await productPage.getBarNotificationText();
      await allure.attachment('Bar Notification Text', notificationText, 'text/plain');
      expect(notificationText.toLowerCase()).toContain('added to your shopping cart');
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 6: Verify cart count in header
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 6: Verify shopping cart count in the header', async () => {

    await allure.step('Read the cart count from the header link', async () => {
      const cartCountText = await page.locator('.cart-qty').innerText();
      await allure.attachment('Cart Count Text', cartCountText, 'text/plain');
      expect(cartCountText).toContain('1');
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 7: Navigate to shopping cart
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 7: Navigate to the shopping cart', async () => {

    await allure.step('Click the cart link in the header', async () => {
      await page.locator('.cart-qty').click();
      await expect(page).toHaveURL(/.*cart/);
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 8: Verify correct book is in the cart
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 8: Verify the correct book is in the cart', async () => {

    await allure.step('Read product names from cart table', async () => {
      const cartProducts = await cartPage.getProductNames();
      await allure.attachment('Cart Products', cartProducts.join('\n'), 'text/plain');
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

    await allure.step('Fill shipping estimation form and submit', async () => {
      await allure.parameter('Shipping Country', testData.shipping.country);
      await allure.parameter('Shipping State', testData.shipping.state);
      await allure.parameter('Shipping Zip', testData.shipping.zip);
      await cartPage.estimateShipping(
        testData.shipping.country,
        testData.shipping.state,
        testData.shipping.zip
      );
    });

    await allure.step('Verify shipping options are displayed', async () => {
      await expect(cartPage.shippingResultsSection).toBeVisible();
      const shippingOptions = await cartPage.getShippingOptions();
      expect(shippingOptions.length).toBeGreaterThan(0);
      await allure.attachment('Shipping Options', shippingOptions.join('\n'), 'text/plain');
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 10: Accept terms and proceed to checkout
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 10: Accept terms of service and proceed to checkout', async () => {

    await allure.step('Check the "Terms of Service" checkbox', async () => {
      await cartPage.termsOfServiceCheckbox.check();
      await expect(cartPage.termsOfServiceCheckbox).toBeChecked();
    });

    await allure.step('Click the "Checkout" button', async () => {
      await cartPage.checkoutButton.click();
      await expect(page).toHaveURL(/.*checkout/);
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 11: Fill billing address
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 11: Fill in billing address details', async () => {

    await allure.step('Enter billing address form fields', async () => {
      await allure.parameter('Billing First Name', testData.checkout.firstName);
      await allure.parameter('Billing Last Name', testData.checkout.lastName);
      await allure.parameter('Billing City', testData.checkout.city);
      await allure.parameter('Billing Address', testData.checkout.address);
      await allure.parameter('Billing Zip', testData.checkout.zip);
      await allure.parameter('Billing Phone', testData.checkout.phone);

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

    await allure.step('Click "Continue" on billing step', async () => {
      await checkoutPage.continueBilling();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 12: Shipping address step
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 12: Confirm shipping address (same as billing)', async () => {

    await allure.step('Click "Continue" on shipping address step', async () => {
      await checkoutPage.continueShipping();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 13: Select shipping method
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 13: Select shipping method', async () => {

    await allure.step('Select the first available shipping method', async () => {
      await checkoutPage.selectShippingMethod(0);
    });

    await allure.step('Click "Continue" on shipping method step', async () => {
      await checkoutPage.continueShippingMethod();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 14: Select payment method
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 14: Select payment method', async () => {

    await allure.step('Select "Check / Money Order" payment method', async () => {
      await checkoutPage.selectPaymentMethod('Check / Money Order');
    });

    await allure.step('Click "Continue" on payment method step', async () => {
      await checkoutPage.continuePaymentMethod();
    });

    await allure.step('Continue through payment info step (if visible)', async () => {
      await checkoutPage.continuePaymentInfo();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 15: Confirm order
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 15: Confirm the order', async () => {

    await allure.step('Click "Confirm" to place the order', async () => {
      await checkoutPage.confirmOrder();
    });

  });

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 16: Verify Thank You / Order Confirmation page
  // ─────────────────────────────────────────────────────────────────────────
  await test.step('Step 16: Verify order confirmation page', async () => {

    await allure.step('Verify URL is the order completed page', async () => {
      await expect(page).toHaveURL(/.*completed/);
    });

    await allure.step('Verify the order success message is displayed', async () => {
      const isSuccessful = await orderConfirmationPage.isOrderSuccessful();
      expect(isSuccessful, 'Order completed section should be visible').toBeTruthy();
    });

    await allure.step('Verify and capture the order number', async () => {
      const orderNumber = await orderConfirmationPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
      expect(orderNumber.trim().length).toBeGreaterThan(0);
      await allure.attachment('Order Number', orderNumber, 'text/plain');
      await allure.parameter('Order Number', orderNumber);
    });

  });

});
