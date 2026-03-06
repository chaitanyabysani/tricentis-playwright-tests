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
  await feature('Computers');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 5B — Computers (/computers)', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 5B.1  Three subcategory tiles are shown
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5B.1] Three subcategory tiles (Desktops, Notebooks, Accessories) are shown', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, the Computers page shows three subcategory tiles');
    await severity(Severity.NORMAL);
    await tag('Computers'); await tag('Regression'); await tag('Navigation');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the Computers category page displays exactly 3 subcategory tiles:
      Desktops, Notebooks, and Accessories.</p>
      <h2>Expected Result</h2>
      <p>Three subcategory tiles are visible with correct names.</p>
    `);

    const pom = new PageObjectManager(page);
    const computersPage = pom.getComputersPage();

    await test.step('Step 1: Navigate to /computers', async () => {
      await step('Go to Computers category page', async () => {
        await computersPage.goto();
        await expect(page).toHaveURL(/.*\/computers.*/);
      });
    });

    await test.step('Step 2: Verify 3 subcategory tiles', async () => {
      await step('Assert subcategory count is 3', async () => {
        const count = await computersPage.getSubcategoryCount();
        await parameter('Subcategory Count', String(count));
        expect(count).toBe(3);
      });
    });

    await test.step('Step 3: Verify each subcategory tile is visible', async () => {
      await step('Assert Desktops tile is visible', async () => {
        await expect(computersPage.desktopsLink).toBeVisible();
      });
      await step('Assert Notebooks tile is visible', async () => {
        await expect(computersPage.notebooksLink).toBeVisible();
      });
      await step('Assert Accessories tile is visible', async () => {
        await expect(computersPage.accessoriesLink).toBeVisible();
      });
      await attachment('Subcategories', JSON.stringify(['Desktops', 'Notebooks', 'Accessories'], null, 2), 'application/json');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5B.2  Click Desktops → navigate to /desktops
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5B.2] Click Desktops → navigate to /desktops', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, clicking Desktops tile navigates to the Desktops sub-category page');
    await severity(Severity.CRITICAL);
    await tag('Computers'); await tag('Regression'); await tag('Navigation');

    const pom = new PageObjectManager(page);
    const computersPage = pom.getComputersPage();

    await test.step('Step 1: Navigate to /computers', async () => {
      await step('Go to Computers category page', async () => {
        await computersPage.goto();
      });
    });

    await test.step('Step 2: Click the Desktops tile', async () => {
      await step('Click Desktops link', async () => {
        await computersPage.navigateToDesktops();
      });
    });

    await test.step('Step 3: Verify /desktops page loaded', async () => {
      await step('Assert URL is /desktops and heading is visible', async () => {
        await expect(page).toHaveURL(/.*\/desktops.*/);
        const heading = page.locator('.page-title h1');
        await expect(heading).toBeVisible();
        await attachment('Desktops Page Title', await heading.innerText(), 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5B.3  Click Notebooks → navigate to /notebooks
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5B.3] Click Notebooks → navigate to /notebooks', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, clicking Notebooks tile navigates to the Notebooks sub-category page');
    await severity(Severity.CRITICAL);
    await tag('Computers'); await tag('Regression'); await tag('Navigation');

    const pom = new PageObjectManager(page);
    const computersPage = pom.getComputersPage();

    await test.step('Step 1: Navigate to /computers', async () => {
      await step('Go to Computers category page', async () => {
        await computersPage.goto();
      });
    });

    await test.step('Step 2: Click the Notebooks tile', async () => {
      await step('Click Notebooks link', async () => {
        await computersPage.navigateToNotebooks();
      });
    });

    await test.step('Step 3: Verify /notebooks page loaded', async () => {
      await step('Assert URL is /notebooks and heading is visible', async () => {
        await expect(page).toHaveURL(/.*\/notebooks.*/);
        const heading = page.locator('.page-title h1');
        await expect(heading).toBeVisible();
        await attachment('Notebooks Page Title', await heading.innerText(), 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5B.4  Click Accessories → navigate to /accessories
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5B.4] Click Accessories → navigate to /accessories', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, clicking Accessories tile navigates to the Accessories sub-category page');
    await severity(Severity.CRITICAL);
    await tag('Computers'); await tag('Regression'); await tag('Navigation');

    const pom = new PageObjectManager(page);
    const computersPage = pom.getComputersPage();

    await test.step('Step 1: Navigate to /computers', async () => {
      await step('Go to Computers category page', async () => {
        await computersPage.goto();
      });
    });

    await test.step('Step 2: Click the Accessories tile', async () => {
      await step('Click Accessories link', async () => {
        await computersPage.navigateToAccessories();
      });
    });

    await test.step('Step 3: Verify /accessories page loaded', async () => {
      await step('Assert URL is /accessories and heading is visible', async () => {
        await expect(page).toHaveURL(/.*\/accessories.*/);
        const heading = page.locator('.page-title h1');
        await expect(heading).toBeVisible();
        await attachment('Accessories Page Title', await heading.innerText(), 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5B.5  Desktops: configure and add a custom computer to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5B.5] Desktops: configure and add a custom computer to cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can configure a custom computer and add it to cart');
    await severity(Severity.CRITICAL);
    await tag('Computers'); await tag('Regression'); await tag('Cart'); await tag('Configure');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a user can navigate to the "Build your own computer" product, configure
      processor, RAM, HDD, OS, and software options, then successfully add it to the cart.</p>
      <h2>Expected Result</h2>
      <p>The configured computer is added to cart and a success notification appears.</p>
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

    await test.step('Step 2: Navigate to Build Your Own Computer product', async () => {
      await step('Go to /desktops and click "Build your own computer"', async () => {
        await page.goto('/desktops');
        const buildComputerLink = page.getByRole('link', { name: 'Build your own computer' }).first();
        await buildComputerLink.click();
        await expect(page).toHaveURL(/.*build-your-own-computer.*/);
      });
    });

    await test.step('Step 3: Configure the computer options', async () => {
      await step('Select processor', async () => {
        const processorDropdown = page.locator('#product_attribute_1');
        await processorDropdown.selectOption({ index: 0 });
        const selected = await processorDropdown.locator('option:checked').innerText();
        await parameter('Processor', selected);
      });
      await step('Select RAM', async () => {
        const ramDropdown = page.locator('#product_attribute_2');
        await ramDropdown.selectOption({ index: 0 });
        const selected = await ramDropdown.locator('option:checked').innerText();
        await parameter('RAM', selected);
      });
      await step('Select HDD', async () => {
        const hddOptions = page.locator('input[name="product_attribute_3"]');
        await hddOptions.first().check();
      });
      await step('Select OS', async () => {
        const osOptions = page.locator('input[name="product_attribute_4"]');
        await osOptions.first().check();
      });
    });

    await test.step('Step 4: Add to cart and verify notification', async () => {
      await step('Click Add to Cart button', async () => {
        await page.locator('#add-to-cart-button-1').click();
        await page.waitForTimeout(1500);
      });
      await step('Assert success bar notification appears', async () => {
        const notification = page.locator('#bar-notification');
        await expect(notification).toBeVisible({ timeout: 10000 });
        const notifText = await notification.innerText();
        await attachment('Cart Notification', notifText, 'text/plain');
        expect(notifText.toLowerCase()).toContain('cart');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5B.6  Notebooks: sort and add a notebook to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5B.6] Notebooks: sort and add a notebook to cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can sort notebooks and add one to the cart');
    await severity(Severity.NORMAL);
    await tag('Computers'); await tag('Regression'); await tag('Cart'); await tag('Sort');

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

    await test.step('Step 2: Navigate to /notebooks and sort by price', async () => {
      await step('Go to /notebooks and sort by Price Low to High', async () => {
        await page.goto('/notebooks');
        await expect(page).toHaveURL(/.*\/notebooks.*/);
        const sortDropdown = page.locator('#products-orderby');
        await sortDropdown.selectOption('price-asc');
        await page.waitForLoadState('networkidle');
        await parameter('Sort Applied', 'Price Low to High');
      });
    });

    await test.step('Step 3: Add first notebook to cart', async () => {
      await step('Click Add to Cart for the first notebook', async () => {
        const addToCartBtn = page.locator('.product-item .product-box-add-to-cart-button').first();
        const productName = await page.locator('.product-item .product-title a').first().innerText();
        await parameter('Product Added', productName.trim());
        await addToCartBtn.click();
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
  // 5B.7  Accessories: filter and add an accessory to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5B.7] Accessories: filter and add an accessory to cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can browse accessories and add one to the cart');
    await severity(Severity.NORMAL);
    await tag('Computers'); await tag('Regression'); await tag('Cart');

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

    await test.step('Step 2: Navigate to /accessories', async () => {
      await step('Go to Accessories sub-category page', async () => {
        await page.goto('/accessories');
        await expect(page).toHaveURL(/.*\/accessories.*/);
        const heading = page.locator('.page-title h1');
        await expect(heading).toBeVisible();
      });
    });

    await test.step('Step 3: Add first accessory to cart', async () => {
      await step('Click Add to Cart for the first accessory', async () => {
        const productName = await page.locator('.product-item .product-title a').first().innerText();
        await parameter('Product Added', productName.trim());
        const addToCartBtn = page.locator('.product-item .product-box-add-to-cart-button').first();
        await addToCartBtn.click();
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
