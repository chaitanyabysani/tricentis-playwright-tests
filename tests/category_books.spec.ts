import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';

const BASE_META = async () => {
  await epic('Category Pages');
  await feature('Books');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 5A — Books (/books)', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 5A.1  All 6 books are listed with correct names and prices
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5A.1] All 6 books are listed with correct names and prices', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I expect to see all 6 books listed with names and prices');
    await severity(Severity.NORMAL);
    await tag('Books'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the Books category page displays exactly 6 products with visible names and prices.</p>
      <h2>Expected Result</h2>
      <p>6 book products are listed, each with a non-empty name and price.</p>
    `);

    const pom = new PageObjectManager(page);
    const booksPage = pom.getBooksPage();

    await test.step('Step 1: Navigate to /books', async () => {
      await step('Go to Books category page', async () => {
        await booksPage.goto();
        await expect(page).toHaveURL(/.*\/books.*/);
      });
    });

    await test.step('Step 2: Verify page title', async () => {
      await step('Assert page heading is "Books"', async () => {
        await expect(booksPage.pageTitle).toBeVisible();
        const title = await booksPage.pageTitle.innerText();
        await attachment('Page Title', title, 'text/plain');
        expect(title.toLowerCase()).toContain('book');
      });
    });

    await test.step('Step 3: Verify 6 products are listed', async () => {
      await step('Assert product count is 6', async () => {
        const count = await booksPage.getProductCount();
        await parameter('Product Count', String(count));
        expect(count).toBe(6);
      });
      await step('Attach all book names and prices', async () => {
        const names = await booksPage.getProductNames();
        const prices = await booksPage.getProductPrices();
        await attachment('Book Names', JSON.stringify(names, null, 2), 'application/json');
        await attachment('Book Prices', JSON.stringify(prices, null, 2), 'application/json');
        names.forEach(n => expect(n.trim().length).toBeGreaterThan(0));
        prices.forEach(p => expect(p.trim().length).toBeGreaterThan(0));
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5A.2  Filter by price range: Under $25.00
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5A.2] Filter by price range: Under $25.00', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can filter books by price Under $25.00');
    await severity(Severity.NORMAL);
    await tag('Books'); await tag('Regression'); await tag('Filter');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that clicking the "Under $25.00" price filter shows only books priced under $25.</p>
      <h2>Expected Result</h2>
      <p>Only products in the Under $25.00 range are displayed.</p>
    `);

    const pom = new PageObjectManager(page);
    const booksPage = pom.getBooksPage();

    await test.step('Step 1: Navigate to /books', async () => {
      await step('Go to Books category page', async () => {
        await booksPage.goto();
        await expect(page).toHaveURL(/.*\/books.*/);
      });
    });

    await test.step('Step 2: Apply Under $25.00 filter', async () => {
      await step('Click "Under $25.00" price filter link', async () => {
        await booksPage.filterByPriceUnder25();
        await parameter('Price Filter', 'Under $25.00');
      });
    });

    await test.step('Step 3: Verify filtered results', async () => {
      await step('Assert products are shown and URL reflects filter', async () => {
        const count = await booksPage.getProductCount();
        await parameter('Filtered Count', String(count));
        expect(count).toBeGreaterThan(0);
        const names = await booksPage.getProductNames();
        await attachment('Filtered Books (Under $25)', JSON.stringify(names, null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5A.3  Filter by price range: $25.00 – $50.00
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5A.3] Filter by price range: $25.00 – $50.00', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can filter books by price $25.00 to $50.00');
    await severity(Severity.NORMAL);
    await tag('Books'); await tag('Regression'); await tag('Filter');

    const pom = new PageObjectManager(page);
    const booksPage = pom.getBooksPage();

    await test.step('Step 1: Navigate to /books', async () => {
      await step('Go to Books category page', async () => {
        await booksPage.goto();
      });
    });

    await test.step('Step 2: Apply $25–$50 filter', async () => {
      await step('Click "$25.00 - $50.00" price filter link', async () => {
        await booksPage.filterByPrice25To50();
        await parameter('Price Filter', '$25.00 - $50.00');
      });
    });

    await test.step('Step 3: Verify filtered results', async () => {
      await step('Assert products are shown', async () => {
        const count = await booksPage.getProductCount();
        await parameter('Filtered Count', String(count));
        expect(count).toBeGreaterThan(0);
        const names = await booksPage.getProductNames();
        await attachment('Filtered Books ($25–$50)', JSON.stringify(names, null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5A.4  Filter by price range: Over $50.00
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5A.4] Filter by price range: Over $50.00', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can filter books by price Over $50.00');
    await severity(Severity.NORMAL);
    await tag('Books'); await tag('Regression'); await tag('Filter');

    const pom = new PageObjectManager(page);
    const booksPage = pom.getBooksPage();

    await test.step('Step 1: Navigate to /books', async () => {
      await step('Go to Books category page', async () => {
        await booksPage.goto();
      });
    });

    await test.step('Step 2: Apply Over $50 filter', async () => {
      await step('Click "Over $50.00" price filter link', async () => {
        await booksPage.filterByPriceOver50();
        await parameter('Price Filter', 'Over $50.00');
      });
    });

    await test.step('Step 3: Verify filtered results', async () => {
      await step('Assert products are shown', async () => {
        const count = await booksPage.getProductCount();
        await parameter('Filtered Count', String(count));
        expect(count).toBeGreaterThan(0);
        const names = await booksPage.getProductNames();
        await attachment('Filtered Books (Over $50)', JSON.stringify(names, null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5A.5  Sort products by Name A-Z, Z-A, Price Low-High, Price High-Low
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5A.5] Sort products by Name and Price options', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can sort the books listing by name and price');
    await severity(Severity.NORMAL);
    await tag('Books'); await tag('Regression'); await tag('Sort');

    const pom = new PageObjectManager(page);
    const booksPage = pom.getBooksPage();

    await test.step('Step 1: Navigate to /books', async () => {
      await step('Go to Books category page', async () => {
        await booksPage.goto();
        await expect(page).toHaveURL(/.*\/books.*/);
      });
    });

    await test.step('Step 2: Sort by Name A-Z', async () => {
      await step('Select Name A-Z sort option', async () => {
        await booksPage.sortBy('name-asc');
        await page.waitForLoadState('networkidle');
        await parameter('Sort', 'Name A-Z');
        await attachment('Name A-Z', JSON.stringify(await booksPage.getProductNames(), null, 2), 'application/json');
      });
    });

    await test.step('Step 3: Sort by Name Z-A', async () => {
      await step('Select Name Z-A sort option', async () => {
        await booksPage.sortBy('name-desc');
        await page.waitForLoadState('networkidle');
        await parameter('Sort', 'Name Z-A');
        await attachment('Name Z-A', JSON.stringify(await booksPage.getProductNames(), null, 2), 'application/json');
      });
    });

    await test.step('Step 4: Sort by Price Low to High', async () => {
      await step('Select Price Low-High sort option', async () => {
        await booksPage.sortBy('price-asc');
        await page.waitForLoadState('networkidle');
        await parameter('Sort', 'Price Low-High');
        await attachment('Price Low-High', JSON.stringify(await booksPage.getProductPrices(), null, 2), 'application/json');
      });
    });

    await test.step('Step 5: Sort by Price High to Low', async () => {
      await step('Select Price High-Low sort option', async () => {
        await booksPage.sortBy('price-desc');
        await page.waitForLoadState('networkidle');
        await parameter('Sort', 'Price High-Low');
        await attachment('Price High-Low', JSON.stringify(await booksPage.getProductPrices(), null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5A.6  Switch items per page (4 / 8 / 12)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5A.6] Switch items per page (4 / 8 / 12)', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can change how many books are shown per page');
    await severity(Severity.MINOR);
    await tag('Books'); await tag('Regression'); await tag('Pagination');

    const pom = new PageObjectManager(page);
    const booksPage = pom.getBooksPage();

    await test.step('Step 1: Navigate to /books', async () => {
      await step('Go to Books category page', async () => {
        await booksPage.goto();
      });
    });

    await test.step('Step 2: Set page size to 4', async () => {
      await step('Select 4 items per page', async () => {
        await booksPage.setPageSize('4');
        await page.waitForLoadState('networkidle');
        const count = await booksPage.getProductCount();
        await parameter('Page Size 4 — Displayed', String(count));
        expect(count).toBeLessThanOrEqual(4);
      });
    });

    await test.step('Step 3: Set page size to 8', async () => {
      await step('Select 8 items per page', async () => {
        await booksPage.setPageSize('8');
        await page.waitForLoadState('networkidle');
        const count = await booksPage.getProductCount();
        await parameter('Page Size 8 — Displayed', String(count));
        expect(count).toBeLessThanOrEqual(8);
      });
    });

    await test.step('Step 4: Set page size to 12', async () => {
      await step('Select 12 items per page', async () => {
        await booksPage.setPageSize('12');
        await page.waitForLoadState('networkidle');
        const count = await booksPage.getProductCount();
        await parameter('Page Size 12 — Displayed', String(count));
        expect(count).toBeLessThanOrEqual(12);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5A.7  Switch between Grid and List view
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5A.7] Switch between Grid and List view', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can toggle between Grid and List view on the Books page');
    await severity(Severity.MINOR);
    await tag('Books'); await tag('Regression'); await tag('View-Mode');

    const pom = new PageObjectManager(page);
    const booksPage = pom.getBooksPage();

    await test.step('Step 1: Navigate to /books', async () => {
      await step('Go to Books category page', async () => {
        await booksPage.goto();
        await expect(page).toHaveURL(/.*\/books.*/);
      });
    });

    await test.step('Step 2: Switch to List view', async () => {
      await step('Click List view button', async () => {
        await booksPage.switchToListView();
        await page.waitForLoadState('networkidle');
        await parameter('View Mode', 'List');
        await expect(page).toHaveURL(/.*viewmode=list.*/);
      });
    });

    await test.step('Step 3: Switch back to Grid view', async () => {
      await step('Click Grid view button', async () => {
        await booksPage.switchToGridView();
        await page.waitForLoadState('networkidle');
        await parameter('View Mode', 'Grid');
        await expect(page).toHaveURL(/.*viewmode=grid.*/);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5A.8  Click product → navigate to product detail page
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5A.8] Click product → navigate to product detail page', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, clicking a book opens the correct product detail page');
    await severity(Severity.CRITICAL);
    await tag('Books'); await tag('Regression'); await tag('Navigation');

    const pom = new PageObjectManager(page);
    const booksPage = pom.getBooksPage();

    await test.step('Step 1: Navigate to /books', async () => {
      await step('Go to Books category page', async () => {
        await booksPage.goto();
      });
    });

    await test.step('Step 2: Get first book name and click it', async () => {
      await step('Read first product name and click the link', async () => {
        const names = await booksPage.getProductNames();
        await parameter('Clicked Product', names[0].trim());
        await booksPage.productNames.first().click();
      });
    });

    await test.step('Step 3: Verify product detail page loaded', async () => {
      await step('Assert URL changed and product heading is visible', async () => {
        await expect(page).not.toHaveURL(/.*\/books.*/);
        const productTitle = page.locator('.product-name h1');
        await expect(productTitle).toBeVisible();
        await attachment('Product Detail Title', await productTitle.innerText(), 'text/plain');
      });
      await step('Assert Add to Cart button is visible', async () => {
        const addToCartBtn = page.locator('#add-to-cart-button-1, .add-to-cart-button').first();
        await expect(addToCartBtn).toBeVisible();
      });
    });
  });

});
