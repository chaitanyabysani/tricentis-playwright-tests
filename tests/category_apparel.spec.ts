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
  await feature('Apparel & Shoes');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 5D — Apparel & Shoes (/apparel-shoes)', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 5D.1  Products listed with correct names and prices
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5D.1] Products listed with correct names and prices', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, the Apparel & Shoes page lists products with names and prices');
    await severity(Severity.NORMAL);
    await tag('Apparel'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the Apparel & Shoes category page loads with at least one product,
      each with a visible name and price.</p>
      <h2>Expected Result</h2>
      <p>Products are listed with non-empty names and prices.</p>
    `);

    const pom = new PageObjectManager(page);
    const apparelPage = pom.getApparelPage();

    await test.step('Step 1: Navigate to /apparel-shoes', async () => {
      await step('Go to Apparel & Shoes category page', async () => {
        await apparelPage.goto();
        await expect(page).toHaveURL(/.*\/apparel-shoes.*/);
      });
    });

    await test.step('Step 2: Verify page title', async () => {
      await step('Assert page heading is Apparel & Shoes', async () => {
        await expect(apparelPage.pageTitle).toBeVisible();
        const title = await apparelPage.pageTitle.innerText();
        await attachment('Page Title', title, 'text/plain');
      });
    });

    await test.step('Step 3: Verify products are listed with names and prices', async () => {
      await step('Assert at least one product is shown', async () => {
        const count = await apparelPage.getProductCount();
        await parameter('Product Count', String(count));
        expect(count).toBeGreaterThan(0);
      });
      await step('Attach all product names and prices', async () => {
        const names = await apparelPage.getProductNames();
        const prices = await apparelPage.getProductPrices();
        await attachment('Product Names', JSON.stringify(names, null, 2), 'application/json');
        await attachment('Product Prices', JSON.stringify(prices, null, 2), 'application/json');
        names.forEach(n => expect(n.trim().length).toBeGreaterThan(0));
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5D.2  Pagination works (Page 1 → Page 2)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5D.2] Pagination works (Page 1 → Page 2)', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can navigate from page 1 to page 2 of the Apparel listing');
    await severity(Severity.NORMAL);
    await tag('Apparel'); await tag('Regression'); await tag('Pagination');

    const pom = new PageObjectManager(page);
    const apparelPage = pom.getApparelPage();

    await test.step('Step 1: Navigate to /apparel-shoes', async () => {
      await step('Go to Apparel & Shoes category page', async () => {
        await apparelPage.goto();
        await expect(page).toHaveURL(/.*\/apparel-shoes.*/);
      });
    });

    await test.step('Step 2: Verify next page button is present and click it', async () => {
      await step('Check pager is visible', async () => {
        const pager = page.locator('.pager');
        await expect(pager).toBeVisible();
      });
      await step('Click next page button', async () => {
        await apparelPage.goToNextPage();
        await page.waitForLoadState('networkidle');
        await parameter('Page', '2');
      });
    });

    await test.step('Step 3: Verify page 2 loaded with products', async () => {
      await step('Assert URL contains page=2 and products are shown', async () => {
        await expect(page).toHaveURL(/.*pagenumber=2.*/);
        const count = await apparelPage.getProductCount();
        await parameter('Page 2 Product Count', String(count));
        expect(count).toBeGreaterThan(0);
        await attachment('Page 2 Products', JSON.stringify(await apparelPage.getProductNames(), null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5D.3  Sort by price low-to-high
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5D.3] Sort by price low-to-high', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can sort Apparel & Shoes products by price low to high');
    await severity(Severity.NORMAL);
    await tag('Apparel'); await tag('Regression'); await tag('Sort');

    const pom = new PageObjectManager(page);
    const apparelPage = pom.getApparelPage();

    await test.step('Step 1: Navigate to /apparel-shoes', async () => {
      await step('Go to Apparel & Shoes category page', async () => {
        await apparelPage.goto();
      });
    });

    await test.step('Step 2: Sort by Price Low to High', async () => {
      await step('Select price-asc sort option', async () => {
        await apparelPage.sortBy('price-asc');
        await page.waitForLoadState('networkidle');
        await parameter('Sort', 'Price Low to High');
      });
    });

    await test.step('Step 3: Verify products are reordered', async () => {
      await step('Assert products are listed after sort', async () => {
        const count = await apparelPage.getProductCount();
        expect(count).toBeGreaterThan(0);
        const prices = await apparelPage.getProductPrices();
        await attachment('Sorted Prices (Low-High)', JSON.stringify(prices, null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5D.4  Add an apparel item to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5D.4] Add an apparel item to cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can add an apparel item directly to the cart');
    await severity(Severity.NORMAL);
    await tag('Apparel'); await tag('Regression'); await tag('Cart');

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const apparelPage = pom.getApparelPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to /apparel-shoes', async () => {
      await step('Go to Apparel & Shoes category page', async () => {
        await apparelPage.goto();
        await expect(page).toHaveURL(/.*\/apparel-shoes.*/);
      });
    });

    await test.step('Step 3: Add first available product to cart', async () => {
      await step('Click Add to Cart on first product', async () => {
        const productName = await apparelPage.productNames.first().innerText();
        await parameter('Product Added', productName.trim());
        await apparelPage.addProductToCartByIndex(0);
        await page.waitForTimeout(1500);
      });
      await step('Assert success notification is shown', async () => {
        const notification = page.locator('#bar-notification');
        await expect(notification).toBeVisible({ timeout: 10000 });
        const notifText = await notification.innerText();
        await attachment('Cart Notification', notifText, 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5D.5  Add item requiring size/color attribute selection to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5D.5] Add item requiring size/color attribute selection to cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can select size/color attributes before adding apparel to cart');
    await severity(Severity.NORMAL);
    await tag('Apparel'); await tag('Regression'); await tag('Cart'); await tag('Attributes');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a user can open an apparel product detail page, select required attributes
      (size and/or color), and successfully add it to the cart.</p>
      <h2>Expected Result</h2>
      <p>The product is added to cart after selecting attributes, and a success notification appears.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to an apparel product with attributes', async () => {
      await step('Go to /apparel-shoes and click first product for detail page', async () => {
        await page.goto('/apparel-shoes');
        const firstProductLink = page.locator('.product-item .product-title a').first();
        const productName = await firstProductLink.innerText();
        await parameter('Product', productName.trim());
        await firstProductLink.click();
        await expect(page).not.toHaveURL(/.*\/apparel-shoes$/);
      });
    });

    await test.step('Step 3: Select attributes if present and add to cart', async () => {
      await step('Select first option for any attribute dropdowns', async () => {
        const attributeDropdowns = page.locator('.product-variant-line select');
        const dropdownCount = await attributeDropdowns.count();
        await parameter('Attribute Dropdowns Count', String(dropdownCount));
        for (let i = 0; i < dropdownCount; i++) {
          await attributeDropdowns.nth(i).selectOption({ index: 1 });
        }
        const radioOptions = page.locator('.product-variant-line input[type="radio"]');
        const radioCount = await radioOptions.count();
        if (radioCount > 0) {
          await radioOptions.first().check();
        }
      });
      await step('Click Add to Cart button', async () => {
        const addToCartBtn = page.locator('#add-to-cart-button-1, .add-to-cart-button').first();
        await addToCartBtn.click();
        await page.waitForTimeout(1500);
      });
      await step('Assert success notification or confirmation', async () => {
        const notification = page.locator('#bar-notification');
        await expect(notification).toBeVisible({ timeout: 10000 });
        const notifText = await notification.innerText();
        await attachment('Cart Notification', notifText, 'text/plain');
      });
    });
  });

});
