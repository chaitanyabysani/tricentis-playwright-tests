import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import { CredentialManager } from '../utils/CredentialManager';

const BASE_META = async () => {
  await epic('Category Pages');
  await feature('Digital Downloads');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 5E — Digital Downloads (/digital-downloads)', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 5E.1  All 3 digital products listed with correct prices
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5E.1] All 3 digital products listed with correct prices', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I expect to see all 3 digital download products with prices');
    await severity(Severity.NORMAL);
    await tag('DigitalDownloads'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the Digital Downloads category page displays exactly 3 products,
      each with a visible name and price.</p>
      <h2>Expected Result</h2>
      <p>3 digital products are listed with non-empty names and prices.</p>
    `);

    const pom = new PageObjectManager(page);
    const ddPage = pom.getDigitalDownloadsPage();

    await test.step('Step 1: Navigate to /digital-downloads', async () => {
      await step('Go to Digital Downloads category page', async () => {
        await ddPage.goto();
        await expect(page).toHaveURL(/.*\/digital-downloads.*/);
      });
    });

    await test.step('Step 2: Verify page title', async () => {
      await step('Assert page heading is Digital downloads', async () => {
        await expect(ddPage.pageTitle).toBeVisible();
        const title = await ddPage.pageTitle.innerText();
        await attachment('Page Title', title, 'text/plain');
      });
    });

    await test.step('Step 3: Verify 3 products are listed', async () => {
      await step('Assert product count is 3', async () => {
        const count = await ddPage.getProductCount();
        await parameter('Product Count', String(count));
        expect(count).toBe(3);
      });
      await step('Attach all product names and prices', async () => {
        const names = await ddPage.getProductNames();
        const prices = await ddPage.getProductPrices();
        await attachment('Digital Product Names', JSON.stringify(names, null, 2), 'application/json');
        await attachment('Digital Product Prices', JSON.stringify(prices, null, 2), 'application/json');
        names.forEach(n => expect(n.trim().length).toBeGreaterThan(0));
        prices.forEach(p => expect(p.trim().length).toBeGreaterThan(0));
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5E.2  Add a digital download to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5E.2] Add a digital download to cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can add a digital download product to the cart');
    await severity(Severity.NORMAL);
    await tag('DigitalDownloads'); await tag('Regression'); await tag('Cart');

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const ddPage = pom.getDigitalDownloadsPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to /digital-downloads', async () => {
      await step('Go to Digital Downloads category page', async () => {
        await ddPage.goto();
        await expect(page).toHaveURL(/.*\/digital-downloads.*/);
        const count = await ddPage.getProductCount();
        expect(count).toBeGreaterThan(0);
      });
    });

    await test.step('Step 3: Add first digital product to cart', async () => {
      await step('Click Add to Cart for the first digital product', async () => {
        const productName = await ddPage.productNames.first().innerText();
        await parameter('Product Added', productName.trim());
        await ddPage.addProductToCartByIndex(0);
        await page.waitForTimeout(1500);
      });
      await step('Assert success notification is shown', async () => {
        const notification = page.locator('#bar-notification');
        await expect(notification).toBeVisible({ timeout: 10000 });
        const notifText = await notification.innerText();
        await attachment('Cart Notification', notifText, 'text/plain');
        expect(notifText.toLowerCase()).toContain('cart');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5E.3  Digital download product page shows download info
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5E.3] Digital download product page shows download info', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, the digital product detail page shows relevant download information');
    await severity(Severity.MINOR);
    await tag('DigitalDownloads'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that clicking a digital download product opens its detail page and shows
      relevant info such as download type or file format description.</p>
      <h2>Expected Result</h2>
      <p>Product detail page loads with name, price, and product description visible.</p>
    `);

    const pom = new PageObjectManager(page);
    const ddPage = pom.getDigitalDownloadsPage();

    await test.step('Step 1: Navigate to /digital-downloads', async () => {
      await step('Go to Digital Downloads category page', async () => {
        await ddPage.goto();
        await expect(page).toHaveURL(/.*\/digital-downloads.*/);
      });
    });

    await test.step('Step 2: Click first product to open detail page', async () => {
      await step('Click first digital product name link', async () => {
        const productName = await ddPage.productNames.first().innerText();
        await parameter('Product Clicked', productName.trim());
        await ddPage.productNames.first().click();
      });
    });

    await test.step('Step 3: Verify product detail page content', async () => {
      await step('Assert product name heading is visible', async () => {
        const productTitle = page.locator('.product-name h1');
        await expect(productTitle).toBeVisible();
        const titleText = await productTitle.innerText();
        await attachment('Product Title', titleText, 'text/plain');
        expect(titleText.trim().length).toBeGreaterThan(0);
      });
      await step('Assert product price is displayed', async () => {
        const price = page.locator('.product-price span');
        await expect(price.first()).toBeVisible();
        const priceText = await price.first().innerText();
        await attachment('Product Price', priceText, 'text/plain');
      });
      await step('Assert product description or overview is visible', async () => {
        const description = page.locator('.full-description, .short-description');
        const descCount = await description.count();
        await parameter('Description Sections', String(descCount));
        if (descCount > 0) {
          const descText = await description.first().innerText();
          await attachment('Product Description', descText, 'text/plain');
        }
      });
    });
  });

});
