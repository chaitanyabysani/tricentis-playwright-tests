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
  await feature('Electronics');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 5C — Electronics (/electronics)', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 5C.1  Two subcategory tiles (Camera/Photo, Cell Phones) are shown
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5C.1] Two subcategory tiles (Camera/Photo, Cell Phones) are shown', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, the Electronics page shows two subcategory tiles');
    await severity(Severity.NORMAL);
    await tag('Electronics'); await tag('Regression'); await tag('Navigation');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the Electronics category page displays exactly 2 subcategory tiles:
      Camera, photo and Cell phones.</p>
      <h2>Expected Result</h2>
      <p>Two subcategory tiles are visible with correct names.</p>
    `);

    const pom = new PageObjectManager(page);
    const electronicsPage = pom.getElectronicsPage();

    await test.step('Step 1: Navigate to /electronics', async () => {
      await step('Go to Electronics category page', async () => {
        await electronicsPage.goto();
        await expect(page).toHaveURL(/.*\/electronics.*/);
      });
    });

    await test.step('Step 2: Verify 2 subcategory tiles', async () => {
      await step('Assert subcategory count is 2', async () => {
        const count = await electronicsPage.getSubcategoryCount();
        await parameter('Subcategory Count', String(count));
        expect(count).toBe(2);
      });
    });

    await test.step('Step 3: Verify each subcategory tile is visible', async () => {
      await step('Assert Camera, photo tile is visible', async () => {
        await expect(electronicsPage.cameraPhotoLink).toBeVisible();
        await parameter('Camera/Photo Tile', 'visible');
      });
      await step('Assert Cell phones tile is visible', async () => {
        await expect(electronicsPage.cellPhonesLink).toBeVisible();
        await parameter('Cell Phones Tile', 'visible');
      });
      await attachment('Subcategories', JSON.stringify(['Camera, photo', 'Cell phones'], null, 2), 'application/json');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5C.2  Click Camera/Photo → navigate to /camera-photo
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5C.2] Click Camera/Photo → navigate to /camera-photo', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, clicking Camera/Photo tile navigates to the Camera & Photo page');
    await severity(Severity.CRITICAL);
    await tag('Electronics'); await tag('Regression'); await tag('Navigation');

    const pom = new PageObjectManager(page);
    const electronicsPage = pom.getElectronicsPage();

    await test.step('Step 1: Navigate to /electronics', async () => {
      await step('Go to Electronics category page', async () => {
        await electronicsPage.goto();
      });
    });

    await test.step('Step 2: Click Camera/Photo tile', async () => {
      await step('Click Camera, photo link', async () => {
        await electronicsPage.navigateToCameraPhoto();
      });
    });

    await test.step('Step 3: Verify /camera-photo page loaded', async () => {
      await step('Assert URL is /camera-photo and heading is visible', async () => {
        await expect(page).toHaveURL(/.*\/camera-photo.*/);
        const heading = page.locator('.page-title h1');
        await expect(heading).toBeVisible();
        await attachment('Camera Photo Page Title', await heading.innerText(), 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5C.3  Click Cell Phones → navigate to /cell-phones
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5C.3] Click Cell Phones → navigate to /cell-phones', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, clicking Cell Phones tile navigates to the Cell Phones page');
    await severity(Severity.CRITICAL);
    await tag('Electronics'); await tag('Regression'); await tag('Navigation');

    const pom = new PageObjectManager(page);
    const electronicsPage = pom.getElectronicsPage();

    await test.step('Step 1: Navigate to /electronics', async () => {
      await step('Go to Electronics category page', async () => {
        await electronicsPage.goto();
      });
    });

    await test.step('Step 2: Click Cell Phones tile', async () => {
      await step('Click Cell phones link', async () => {
        await electronicsPage.navigateToCellPhones();
      });
    });

    await test.step('Step 3: Verify /cell-phones page loaded', async () => {
      await step('Assert URL is /cell-phones and heading is visible', async () => {
        await expect(page).toHaveURL(/.*\/cell-phones.*/);
        const heading = page.locator('.page-title h1');
        await expect(heading).toBeVisible();
        await attachment('Cell Phones Page Title', await heading.innerText(), 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5C.4  Add a camera product to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5C.4] Add a camera product to cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can add a camera product to the cart');
    await severity(Severity.NORMAL);
    await tag('Electronics'); await tag('Regression'); await tag('Cart');

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const cameraPage = pom.getCameraPhotoPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to /camera-photo', async () => {
      await step('Go to Camera & Photo sub-category', async () => {
        await cameraPage.goto();
        await expect(page).toHaveURL(/.*\/camera-photo.*/);
        const count = await cameraPage.getProductCount();
        await parameter('Products Available', String(count));
        expect(count).toBeGreaterThan(0);
      });
    });

    await test.step('Step 3: Add first camera product to cart', async () => {
      await step('Click Add to Cart for the first camera', async () => {
        const productName = await cameraPage.productNames.first().innerText();
        await parameter('Product Added', productName.trim());
        await cameraPage.addProductToCartByIndex(0);
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
  // 5C.5  Add a cell phone to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5C.5] Add a cell phone to cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can add a cell phone to the cart');
    await severity(Severity.NORMAL);
    await tag('Electronics'); await tag('Regression'); await tag('Cart');

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const cellPhonesPage = pom.getCellPhonesPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Navigate to /cell-phones', async () => {
      await step('Go to Cell Phones sub-category', async () => {
        await cellPhonesPage.goto();
        await expect(page).toHaveURL(/.*\/cell-phones.*/);
        const count = await cellPhonesPage.getProductCount();
        await parameter('Products Available', String(count));
        expect(count).toBeGreaterThan(0);
      });
    });

    await test.step('Step 3: Add first cell phone to cart', async () => {
      await step('Click Add to Cart for the first cell phone', async () => {
        const productName = await cellPhonesPage.productNames.first().innerText();
        await parameter('Product Added', productName.trim());
        await cellPhonesPage.addProductToCartByIndex(0);
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

});
