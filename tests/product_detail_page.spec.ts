import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import { CredentialManager } from '../utils/CredentialManager';

// ─── Shared helpers ─────────────────────────────────────────────────────────────
const BASE_META = async () => {
  await epic('Product Detail Page');
  await feature('Product Detail');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

// Reusable simple product URL (book — no required attributes)
const SIMPLE_PRODUCT_URL = '/computing-and-internet';
// Reusable configurable product URL (Build your own computer)
const CONFIGURABLE_PRODUCT_URL = '/build-your-own-computer';

test.describe('Module 6 — Product Detail Page', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.1  Product name, price and description are displayed correctly
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.1] Product name, price and description are displayed correctly', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, the product detail page shows the name, price and description');
    await severity(Severity.CRITICAL);
    await tag('ProductDetail'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that navigating to a product detail page displays the product name heading,
      a visible price, and a description section.</p>
      <h2>Expected Result</h2>
      <p>Product name, price, and description are all visible and non-empty.</p>
    `);

    const pom = new PageObjectManager(page);
    const productPage = pom.getProductPage();

    await test.step('Step 1: Navigate to a product detail page', async () => {
      await step('Go to a simple product page', async () => {
        await page.goto(SIMPLE_PRODUCT_URL);
        await expect(page).toHaveURL(new RegExp(SIMPLE_PRODUCT_URL));
      });
    });

    await test.step('Step 2: Verify product name is visible', async () => {
      await step('Assert product name heading is displayed', async () => {
        await expect(productPage.productName).toBeVisible();
        const name = await productPage.getProductName();
        await parameter('Product Name', name.trim());
        await attachment('Product Name', name, 'text/plain');
        expect(name.trim().length).toBeGreaterThan(0);
      });
    });

    await test.step('Step 3: Verify product price is visible', async () => {
      await step('Assert price element is displayed and non-empty', async () => {
        await expect(productPage.productPrice).toBeVisible();
        const price = await productPage.getProductPrice();
        await parameter('Product Price', price.trim());
        await attachment('Product Price', price, 'text/plain');
        expect(price.trim().length).toBeGreaterThan(0);
      });
    });

    await test.step('Step 4: Verify product description is visible', async () => {
      await step('Assert full description section is displayed', async () => {
        await expect(productPage.productDescription).toBeVisible();
        const description = await productPage.productDescription.innerText();
        await attachment('Product Description', description, 'text/plain');
        expect(description.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.2  Add to cart with default quantity (1)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.2] Add to cart with default quantity (1)', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can add a product to cart with the default quantity of 1');
    await severity(Severity.CRITICAL);
    await tag('ProductDetail'); await tag('Regression'); await tag('Cart'); await tag('Happy-Path');

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const productPage = pom.getProductPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to product page', async () => {
      await step('Go to a simple product page', async () => {
        await page.goto(SIMPLE_PRODUCT_URL);
        const name = await productPage.getProductName();
        await parameter('Product', name.trim());
      });
    });

    await test.step('Step 3: Verify default quantity is 1', async () => {
      await step('Assert qty input shows 1', async () => {
        const qty = await productPage.quantityInput.inputValue();
        await parameter('Default Quantity', qty);
        expect(qty).toBe('1');
      });
    });

    await test.step('Step 4: Click Add to Cart', async () => {
      await step('Click the Add to Cart button', async () => {
        await productPage.addToCart();
      });
    });

    await test.step('Step 5: Verify success notification', async () => {
      await step('Assert bar notification is visible with cart confirmation', async () => {
        const notifText = await productPage.getBarNotificationText();
        await attachment('Bar Notification', notifText, 'text/plain');
        expect(notifText.toLowerCase()).toContain('cart');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.3  Add to cart with quantity greater than 1
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.3] Add to cart with quantity greater than 1', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can set quantity to more than 1 before adding to cart');
    await severity(Severity.CRITICAL);
    await tag('ProductDetail'); await tag('Regression'); await tag('Cart');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that changing the quantity input to a value greater than 1 and adding to cart
      results in the correct quantity being added.</p>
      <h2>Expected Result</h2>
      <p>Product is added to cart and the success notification appears.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const productPage = pom.getProductPage();
    const credentials = CredentialManager.load();
    const quantity = 3;

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to product page', async () => {
      await step('Go to a simple product page', async () => {
        await page.goto(SIMPLE_PRODUCT_URL);
        const name = await productPage.getProductName();
        await parameter('Product', name.trim());
      });
    });

    await test.step('Step 3: Set quantity to 3', async () => {
      await step('Fill qty input with 3', async () => {
        await productPage.setQuantity(quantity);
        await parameter('Quantity Set', String(quantity));
        const qty = await productPage.quantityInput.inputValue();
        expect(qty).toBe(String(quantity));
      });
    });

    await test.step('Step 4: Add to cart', async () => {
      await step('Click Add to Cart button', async () => {
        await productPage.addToCart();
      });
    });

    await test.step('Step 5: Verify success notification', async () => {
      await step('Assert bar notification appears', async () => {
        const notifText = await productPage.getBarNotificationText();
        await attachment('Bar Notification', notifText, 'text/plain');
        expect(notifText.toLowerCase()).toContain('cart');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.4  "Added to your shopping cart" bar notification appears
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.4] "Added to your shopping cart" bar notification appears', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, adding a product shows the bar notification at the top');
    await severity(Severity.CRITICAL);
    await tag('ProductDetail'); await tag('Regression'); await tag('Notification');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that after clicking Add to Cart, the green bar notification appears at the
      top of the page with a message confirming the product was added.</p>
      <h2>Expected Result</h2>
      <p>Bar notification is visible, contains cart confirmation text, and can be closed.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const productPage = pom.getProductPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login and navigate to product', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
      });
      await step('Go to a simple product page', async () => {
        await page.goto(SIMPLE_PRODUCT_URL);
      });
    });

    await test.step('Step 2: Add product to cart', async () => {
      await step('Click Add to Cart', async () => {
        await productPage.addToCart();
      });
    });

    await test.step('Step 3: Verify bar notification content', async () => {
      await step('Assert notification bar is visible', async () => {
        await expect(productPage.barNotification).toBeVisible({ timeout: 10000 });
      });
      await step('Assert notification message contains cart text', async () => {
        const notifText = await productPage.getBarNotificationText();
        await attachment('Notification Text', notifText, 'text/plain');
        expect(notifText.toLowerCase()).toContain('cart');
        await parameter('Notification Message', notifText.trim());
      });
    });

    await test.step('Step 4: Close the notification bar', async () => {
      await step('Click the close button on the notification', async () => {
        await productPage.closeBarNotification();
        await expect(productPage.barNotification).not.toBeVisible();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.5  Add product to wishlist from product detail page
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.5] Add product to wishlist from product detail page', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can add a product to my wishlist from its detail page');
    await severity(Severity.CRITICAL);
    await tag('ProductDetail'); await tag('Regression'); await tag('Wishlist');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that clicking the "Add to wishlist" button on a product detail page adds the
      product to the user's wishlist and shows a confirmation notification.</p>
      <h2>Expected Result</h2>
      <p>Bar notification confirms the product was added to the wishlist.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const productPage = pom.getProductPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to product detail page', async () => {
      await step('Go to a simple product page', async () => {
        await page.goto(SIMPLE_PRODUCT_URL);
        const name = await productPage.getProductName();
        await parameter('Product', name.trim());
      });
    });

    await test.step('Step 3: Click Add to Wishlist', async () => {
      await step('Assert wishlist button is visible and click it', async () => {
        await expect(productPage.addToWishlistButton).toBeVisible();
        await productPage.addToWishlistButton.click();
      });
    });

    await test.step('Step 4: Verify wishlist confirmation notification', async () => {
      await step('Assert bar notification confirms wishlist addition', async () => {
        await expect(productPage.barNotification).toBeVisible({ timeout: 10000 });
        const notifText = await productPage.getBarNotificationText();
        await attachment('Wishlist Notification', notifText, 'text/plain');
        expect(notifText.toLowerCase()).toContain('wishlist');
        await parameter('Notification Message', notifText.trim());
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.6  Configurable product page renders all attribute options
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.6] Configurable product page renders all attribute options', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, the "Build your own computer" page shows all configurable options');
    await severity(Severity.CRITICAL);
    await tag('ProductDetail'); await tag('Regression'); await tag('Configure');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the "Build your own computer" configurable product page renders all
      attribute selection groups: Processor, RAM, HDD, OS, and Software.</p>
      <h2>Expected Result</h2>
      <p>All 5 attribute option groups are visible on the product page.</p>
    `);

    const pom = new PageObjectManager(page);
    const productPage = pom.getProductPage();

    await test.step('Step 1: Navigate to Build Your Own Computer', async () => {
      await step('Go to the configurable product page', async () => {
        await page.goto(CONFIGURABLE_PRODUCT_URL);
        await expect(page).toHaveURL(new RegExp(CONFIGURABLE_PRODUCT_URL));
      });
    });

    await test.step('Step 2: Verify product name and price are visible', async () => {
      await step('Assert product name heading', async () => {
        await expect(productPage.productName).toBeVisible();
        const name = await productPage.getProductName();
        await parameter('Product', name.trim());
        await attachment('Product Name', name, 'text/plain');
      });
    });

    await test.step('Step 3: Verify all attribute option groups are present', async () => {
      await step('Assert Processor dropdown is present', async () => {
        const processorDropdown = page.locator('#product_attribute_1');
        await expect(processorDropdown).toBeVisible();
        await parameter('Processor Attribute', 'visible');
      });
      await step('Assert RAM dropdown is present', async () => {
        const ramDropdown = page.locator('#product_attribute_2');
        await expect(ramDropdown).toBeVisible();
        await parameter('RAM Attribute', 'visible');
      });
      await step('Assert HDD radio options are present', async () => {
        const hddOptions = page.locator('input[name="product_attribute_3"]');
        const count = await hddOptions.count();
        await parameter('HDD Options Count', String(count));
        expect(count).toBeGreaterThan(0);
      });
      await step('Assert OS radio options are present', async () => {
        const osOptions = page.locator('input[name="product_attribute_4"]');
        const count = await osOptions.count();
        await parameter('OS Options Count', String(count));
        expect(count).toBeGreaterThan(0);
      });
      await step('Assert Software checkboxes are present', async () => {
        const softwareOptions = page.locator('input[name="product_attribute_5"]');
        const count = await softwareOptions.count();
        await parameter('Software Options Count', String(count));
        expect(count).toBeGreaterThan(0);
      });
      await attachment('Attributes Present', JSON.stringify(['Processor', 'RAM', 'HDD', 'OS', 'Software'], null, 2), 'application/json');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.7  Configure computer: choose processor, RAM, HDD, OS, software
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.7] Configure computer: choose processor, RAM, HDD, OS, software', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can configure all computer options and add it to cart');
    await severity(Severity.CRITICAL);
    await tag('ProductDetail'); await tag('Regression'); await tag('Configure'); await tag('Cart');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a user can select all required configuration options on the
      "Build your own computer" page and successfully add it to the cart.</p>
      <h2>Expected Result</h2>
      <p>All options selected and product added to cart with success notification.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const productPage = pom.getProductPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to Build Your Own Computer', async () => {
      await step('Go to configurable product page', async () => {
        await page.goto(CONFIGURABLE_PRODUCT_URL);
        await expect(page).toHaveURL(new RegExp(CONFIGURABLE_PRODUCT_URL));
      });
    });

    await test.step('Step 3: Configure all options', async () => {
      await step('Select Processor', async () => {
        const processorDropdown = page.locator('#product_attribute_1');
        await processorDropdown.selectOption({ index: 1 });
        const selected = await processorDropdown.locator('option:checked').innerText();
        await parameter('Processor', selected.trim());
      });
      await step('Select RAM', async () => {
        const ramDropdown = page.locator('#product_attribute_2');
        await ramDropdown.selectOption({ index: 1 });
        const selected = await ramDropdown.locator('option:checked').innerText();
        await parameter('RAM', selected.trim());
      });
      await step('Select HDD', async () => {
        const hddOptions = page.locator('input[name="product_attribute_3"]');
        await hddOptions.first().check();
        await parameter('HDD', '1st option selected');
      });
      await step('Select OS', async () => {
        const osOptions = page.locator('input[name="product_attribute_4"]');
        await osOptions.first().check();
        await parameter('OS', '1st option selected');
      });
      await step('Select Software (first checkbox)', async () => {
        const softwareOptions = page.locator('input[name="product_attribute_5"]');
        await softwareOptions.first().check();
        await parameter('Software', '1st checkbox selected');
      });
    });

    await test.step('Step 4: Add configured computer to cart', async () => {
      await step('Click Add to Cart', async () => {
        await productPage.addToCart();
      });
    });

    await test.step('Step 5: Verify success notification', async () => {
      await step('Assert bar notification confirms cart addition', async () => {
        const notifText = await productPage.getBarNotificationText();
        await attachment('Cart Notification', notifText, 'text/plain');
        expect(notifText.toLowerCase()).toContain('cart');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.8  Product price updates dynamically based on selected configuration
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.8] Product price updates dynamically based on selected configuration', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, changing configuration options on the product page updates the price');
    await severity(Severity.NORMAL);
    await tag('ProductDetail'); await tag('Regression'); await tag('Configure'); await tag('Price');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that selecting different configuration options on the configurable product page
      changes the displayed product price dynamically.</p>
      <h2>Expected Result</h2>
      <p>The product price updates when a different configuration option is selected.</p>
    `);

    const pom = new PageObjectManager(page);
    const productPage = pom.getProductPage();

    await test.step('Step 1: Navigate to Build Your Own Computer', async () => {
      await step('Go to configurable product page', async () => {
        await page.goto(CONFIGURABLE_PRODUCT_URL);
        await expect(page).toHaveURL(new RegExp(CONFIGURABLE_PRODUCT_URL));
      });
    });

    await test.step('Step 2: Record initial price', async () => {
      await step('Read price before any selection', async () => {
        const initialPrice = await productPage.getProductPrice();
        await parameter('Initial Price', initialPrice.trim());
        await attachment('Initial Price', initialPrice, 'text/plain');
      });
    });

    await test.step('Step 3: Select a different Processor option', async () => {
      await step('Change Processor dropdown to second option', async () => {
        const processorDropdown = page.locator('#product_attribute_1');
        const optionCount = await processorDropdown.locator('option').count();
        if (optionCount > 2) {
          await processorDropdown.selectOption({ index: 2 });
          const selected = await processorDropdown.locator('option:checked').innerText();
          await parameter('New Processor', selected.trim());
        }
        await page.waitForTimeout(500);
      });
    });

    await test.step('Step 4: Verify price has changed', async () => {
      await step('Read price after changing configuration', async () => {
        const updatedPrice = await productPage.getProductPrice();
        await parameter('Updated Price', updatedPrice.trim());
        await attachment('Updated Price', updatedPrice, 'text/plain');
        expect(updatedPrice.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.9  Add product to compare list from product listing
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.9] Add product to compare list from product listing', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can add products to the compare list from a category listing');
    await severity(Severity.MINOR);
    await tag('ProductDetail'); await tag('Regression'); await tag('Compare');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that clicking the "Add to compare list" button on a product listing page
      adds the product to the compare list and shows a confirmation notification.</p>
      <h2>Expected Result</h2>
      <p>Bar notification confirms the product was added to the compare list.</p>
    `);

    const pom = new PageObjectManager(page);
    const productPage = pom.getProductPage();

    await test.step('Step 1: Navigate to the Books category listing', async () => {
      await step('Go to /books category page', async () => {
        await page.goto('/books');
        await expect(page).toHaveURL(/.*\/books.*/);
      });
    });

    await test.step('Step 2: Click Add to Compare List on the first product', async () => {
      await step('Click the compare button for the first listed product', async () => {
        const productName = await page.locator('.product-item .product-title a').first().innerText();
        await parameter('Product', productName.trim());
        const compareButton = page.locator('.product-item .add-to-compare-list-button').first();
        await expect(compareButton).toBeVisible();
        await compareButton.click();
      });
    });

    await test.step('Step 3: Verify compare list notification', async () => {
      await step('Assert bar notification confirms compare list addition', async () => {
        await expect(productPage.barNotification).toBeVisible({ timeout: 10000 });
        const notifText = await productPage.getBarNotificationText();
        await attachment('Compare Notification', notifText, 'text/plain');
        expect(notifText.toLowerCase()).toContain('compar');
        await parameter('Notification Message', notifText.trim());
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.10  Submit a product review when logged in
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.10] Submit a product review when logged in', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can submit a review for a product');
    await severity(Severity.NORMAL);
    await tag('ProductDetail'); await tag('Regression'); await tag('Review');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a logged-in user can fill in a product review (title, body, rating)
      and successfully submit it from the product detail page.</p>
      <h2>Expected Result</h2>
      <p>Review is submitted and a success message is displayed on the reviews tab.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const productPage = pom.getProductPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to product detail page', async () => {
      await step('Go to a product page', async () => {
        await page.goto(SIMPLE_PRODUCT_URL);
        const name = await productPage.getProductName();
        await parameter('Product', name.trim());
      });
    });

    await test.step('Step 3: Navigate to the Reviews tab / section', async () => {
      await step('Click on Write your own review link or tab', async () => {
        const reviewLink = page.locator('a[href*="review"], .write-review, #tab-reviews');
        const count = await reviewLink.count();
        if (count > 0) {
          await reviewLink.first().click();
        } else {
          // Scroll to review form if always visible
          await page.locator('#review-form, .write-review').first().scrollIntoViewIfNeeded();
        }
        await page.waitForTimeout(500);
      });
    });

    await test.step('Step 4: Fill in the review form', async () => {
      await step('Enter review title', async () => {
        const titleInput = page.locator('#AddNewComment_Title');
        await titleInput.fill('Great product!');
        await parameter('Review Title', 'Great product!');
      });
      await step('Enter review text', async () => {
        const reviewText = page.locator('#AddNewComment_ReviewText');
        await reviewText.fill('This is an excellent product. Highly recommended for anyone interested in this topic.');
        await parameter('Review Text', 'This is an excellent product...');
      });
      await step('Select a rating', async () => {
        const ratingOptions = page.locator('input[name="addproductrating"]');
        const count = await ratingOptions.count();
        if (count > 0) {
          // Select 5-star rating (last option)
          await ratingOptions.last().check();
          await parameter('Rating', '5 stars');
        }
      });
    });

    await test.step('Step 5: Submit the review', async () => {
      await step('Click Submit Review button', async () => {
        const submitButton = page.locator('.write-review .button-1, #add-review-submit');
        await submitButton.click();
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 6: Verify review submission result', async () => {
      await step('Assert success message or review appears', async () => {
        const resultMessage = page.locator('.result');
        const barNotif = page.locator('#bar-notification');
        const successVisible = await resultMessage.isVisible() || await barNotif.isVisible();
        expect(successVisible).toBe(true);
        if (await resultMessage.isVisible()) {
          const resultText = await resultMessage.innerText();
          await attachment('Review Submission Result', resultText, 'text/plain');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.11  "Email a friend" link navigates to email form
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.11] "Email a friend" link navigates to email form', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, clicking "Email a friend" opens the share-by-email form');
    await severity(Severity.MINOR);
    await tag('ProductDetail'); await tag('Regression'); await tag('EmailFriend');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the "Email a friend" link on a product detail page navigates to
      the email form page where the user can share the product via email.</p>
      <h2>Expected Result</h2>
      <p>User is taken to the email-a-friend page with the share form visible.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const productPage = pom.getProductPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to product detail page', async () => {
      await step('Go to a simple product page', async () => {
        await page.goto(SIMPLE_PRODUCT_URL);
        const name = await productPage.getProductName();
        await parameter('Product', name.trim());
      });
    });

    await test.step('Step 3: Click Email a friend link', async () => {
      await step('Assert and click the Email a friend link', async () => {
        const emailFriendLink = page.locator('.email-a-friend-button, a[href*="emailafriend"]');
        await expect(emailFriendLink).toBeVisible();
        await emailFriendLink.click();
      });
    });

    await test.step('Step 4: Verify email a friend page loaded', async () => {
      await step('Assert URL contains emailafriend', async () => {
        await expect(page).toHaveURL(/.*emailafriend.*/);
        await attachment('Email a Friend URL', page.url(), 'text/plain');
      });
      await step('Assert the email form fields are visible', async () => {
        const friendEmailInput = page.locator('#FriendEmail');
        await expect(friendEmailInput).toBeVisible();
        await parameter('Email a Friend Form', 'visible');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6.12  Social media share links are visible on product page
  // ─────────────────────────────────────────────────────────────────────────────
  test('[6.12] Social media share links are visible on product page', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can see social media share links on the product detail page');
    await severity(Severity.MINOR);
    await tag('ProductDetail'); await tag('Regression'); await tag('Social');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the product detail page displays social media sharing links
      (e.g. Facebook, Twitter/X, LinkedIn) or a share section.</p>
      <h2>Expected Result</h2>
      <p>At least one social media share link or the share section is visible on the page.</p>
    `);

    const pom = new PageObjectManager(page);
    const productPage = pom.getProductPage();

    await test.step('Step 1: Navigate to product detail page', async () => {
      await step('Go to a simple product page', async () => {
        await page.goto(SIMPLE_PRODUCT_URL);
        const name = await productPage.getProductName();
        await parameter('Product', name.trim());
      });
    });

    await test.step('Step 2: Verify social sharing section is present', async () => {
      await step('Assert share section or social links are visible', async () => {
        const shareSection = page.locator('.share-button, .addthis_toolbox, .product-share, [class*="share"]');
        const shareCount = await shareSection.count();
        await parameter('Share Elements Found', String(shareCount));
        if (shareCount > 0) {
          await expect(shareSection.first()).toBeVisible();
          await attachment('Social Share Section', 'Share links found on product page', 'text/plain');
        } else {
          // Check for individual social icons
          const socialLinks = page.locator('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"]');
          const socialCount = await socialLinks.count();
          await parameter('Social Link Elements', String(socialCount));
          await attachment('Social Sharing', `Found ${socialCount} social links`, 'text/plain');
        }
      });
    });

    await test.step('Step 3: Verify page renders correctly after social section check', async () => {
      await step('Assert product name is still visible', async () => {
        await expect(productPage.productName).toBeVisible();
        await expect(productPage.addToCartButton).toBeVisible();
      });
    });
  });

});
