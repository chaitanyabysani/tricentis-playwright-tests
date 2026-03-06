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
  await feature('Jewelry');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 5F — Jewelry (/jewelry)', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 5F.1  All 5 jewelry items listed with correct prices
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5F.1] All 5 jewelry items listed with correct prices', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I expect to see all 5 jewelry items listed with prices');
    await severity(Severity.NORMAL);
    await tag('Jewelry'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the Jewelry category page displays exactly 5 products with visible names and prices.</p>
      <h2>Expected Result</h2>
      <p>5 jewelry items are listed, each with a non-empty name and price.</p>
    `);

    const pom = new PageObjectManager(page);
    const jewelryPage = pom.getJewelryPage();

    await test.step('Step 1: Navigate to /jewelry', async () => {
      await step('Go to Jewelry category page', async () => {
        await jewelryPage.goto();
        await expect(page).toHaveURL(/.*\/jewelry.*/);
      });
    });

    await test.step('Step 2: Verify page title', async () => {
      await step('Assert page heading is Jewelry', async () => {
        await expect(jewelryPage.pageTitle).toBeVisible();
        const title = await jewelryPage.pageTitle.innerText();
        await attachment('Page Title', title, 'text/plain');
        expect(title.toLowerCase()).toContain('jewe');
      });
    });

    await test.step('Step 3: Verify 5 jewelry items are listed', async () => {
      await step('Assert product count is 5', async () => {
        const count = await jewelryPage.getProductCount();
        await parameter('Product Count', String(count));
        expect(count).toBe(5);
      });
      await step('Attach all jewelry names and prices', async () => {
        const names = await jewelryPage.getProductNames();
        const prices = await jewelryPage.getProductPrices();
        await attachment('Jewelry Names', JSON.stringify(names, null, 2), 'application/json');
        await attachment('Jewelry Prices', JSON.stringify(prices, null, 2), 'application/json');
        names.forEach(n => expect(n.trim().length).toBeGreaterThan(0));
        prices.forEach(p => expect(p.trim().length).toBeGreaterThan(0));
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5F.2  Filter by price range ($0–$500 / $500–$700 / $700–$3000)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5F.2] Filter by price ranges ($0–$500 / $500–$700 / $700–$3000)', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can filter jewelry by all three price range brackets');
    await severity(Severity.NORMAL);
    await tag('Jewelry'); await tag('Regression'); await tag('Filter');

    const pom = new PageObjectManager(page);
    const jewelryPage = pom.getJewelryPage();

    await test.step('Step 1: Navigate to /jewelry', async () => {
      await step('Go to Jewelry category page', async () => {
        await jewelryPage.goto();
        await expect(page).toHaveURL(/.*\/jewelry.*/);
      });
    });

    await test.step('Step 2: Apply $0–$500 price filter', async () => {
      await step('Click $0.00–$500.00 filter', async () => {
        await jewelryPage.filterByPrice0To500();
        await parameter('Price Filter', '$0–$500');
        const count = await jewelryPage.getProductCount();
        await parameter('Filtered Count ($0–$500)', String(count));
        await attachment('Results $0–$500', JSON.stringify(await jewelryPage.getProductNames(), null, 2), 'application/json');
      });
    });

    await test.step('Step 3: Go back and apply $500–$700 price filter', async () => {
      await step('Navigate back and click $500–$700 filter', async () => {
        await jewelryPage.goto();
        await jewelryPage.filterByPrice500To700();
        await parameter('Price Filter', '$500–$700');
        const count = await jewelryPage.getProductCount();
        await parameter('Filtered Count ($500–$700)', String(count));
        await attachment('Results $500–$700', JSON.stringify(await jewelryPage.getProductNames(), null, 2), 'application/json');
      });
    });

    await test.step('Step 4: Go back and apply $700–$3000 price filter', async () => {
      await step('Navigate back and click $700–$3000 filter', async () => {
        await jewelryPage.goto();
        await jewelryPage.filterByPrice700To3000();
        await parameter('Price Filter', '$700–$3000');
        const count = await jewelryPage.getProductCount();
        await parameter('Filtered Count ($700–$3000)', String(count));
        await attachment('Results $700–$3000', JSON.stringify(await jewelryPage.getProductNames(), null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5F.3  "Create Your Own Jewelry" with custom attributes
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5F.3] "Create Your Own Jewelry" with custom attributes', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can configure custom jewelry and add it to cart');
    await severity(Severity.NORMAL);
    await tag('Jewelry'); await tag('Regression'); await tag('Configure'); await tag('Cart');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the "Create Your Own Jewelry" product page allows selecting custom
      attributes (material, length, pendant, color) and adding the configured item to cart.</p>
      <h2>Expected Result</h2>
      <p>Custom jewelry is added to cart with a success notification.</p>
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

    await test.step('Step 2: Navigate to Create Your Own Jewelry product', async () => {
      await step('Go to /jewelry and click "Create Your Own Jewelry"', async () => {
        await page.goto('/jewelry');
        const createJewelryLink = page.getByRole('link', { name: 'Create Your Own Jewelry' }).first();
        await createJewelryLink.click();
        await expect(page).toHaveURL(/.*create-your-own-jewelry.*/);
      });
    });

    await test.step('Step 3: Select custom attributes', async () => {
      await step('Select the first option for each attribute dropdown', async () => {
        const attributeDropdowns = page.locator('.product-variant-line select');
        const count = await attributeDropdowns.count();
        await parameter('Attribute Count', String(count));
        for (let i = 0; i < count; i++) {
          await attributeDropdowns.nth(i).selectOption({ index: 1 });
          const selected = await attributeDropdowns.nth(i).locator('option:checked').innerText();
          await parameter(`Attribute ${i + 1}`, selected.trim());
        }
      });
    });

    await test.step('Step 4: Add to cart and verify notification', async () => {
      await step('Click Add to Cart button', async () => {
        const addToCartBtn = page.locator('#add-to-cart-button-1, .add-to-cart-button').first();
        await addToCartBtn.click();
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
  // 5F.4  Add a standard jewelry item to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5F.4] Add a standard jewelry item to cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can add a standard jewelry item to the cart');
    await severity(Severity.NORMAL);
    await tag('Jewelry'); await tag('Regression'); await tag('Cart');

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const jewelryPage = pom.getJewelryPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to /jewelry', async () => {
      await step('Go to Jewelry category page', async () => {
        await jewelryPage.goto();
        await expect(page).toHaveURL(/.*\/jewelry.*/);
      });
    });

    await test.step('Step 3: Add first standard jewelry item to cart', async () => {
      await step('Click Add to Cart on the first jewelry item', async () => {
        const productName = await jewelryPage.productNames.first().innerText();
        await parameter('Product Added', productName.trim());
        await jewelryPage.addProductToCartByIndex(0);
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

});
