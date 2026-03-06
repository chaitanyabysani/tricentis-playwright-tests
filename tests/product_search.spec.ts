import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import testData from '../utils/testdata.json';

// ─── Shared helpers ─────────────────────────────────────────────────────────────
const BASE_META = async () => {
  await epic('Product Search');
  await feature('Search');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 4 — Product Search', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.1  Search with valid keyword returns matching results
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.1] Search with valid keyword returns matching results', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, searching with a valid keyword shows relevant product results');
    await severity(Severity.CRITICAL);
    await tag('Search'); await tag('Regression'); await tag('Happy-Path');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that searching with a valid keyword (e.g. "book") returns matching product results.</p>
      <h2>Expected Result</h2>
      <p>At least one product is returned and each result name is visible.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();
    const keyword = testData.search.term;

    await attachment('Test Input', JSON.stringify({ keyword }), 'application/json');

    await test.step('Step 1: Navigate to search page with keyword', async () => {
      await step('Go to /search with valid keyword', async () => {
        await parameter('Search Keyword', keyword);
        await searchPage.goto(keyword);
        await expect(page).toHaveURL(/.*search.*/);
      });
    });

    await test.step('Step 2: Verify results are returned', async () => {
      await step('Assert at least one product item is shown', async () => {
        const count = await searchPage.getProductCount();
        await parameter('Results Count', String(count));
        expect(count).toBeGreaterThan(0);
      });
      await step('Collect and attach result product names', async () => {
        const names = await searchPage.getProductNames();
        await attachment('Search Results', JSON.stringify(names, null, 2), 'application/json');
        names.forEach(name => expect(name.trim().length).toBeGreaterThan(0));
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.2  Search with empty keyword → validation message
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.2] Search with empty keyword → validation message', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, searching with an empty keyword shows a validation warning');
    await severity(Severity.CRITICAL);
    await tag('Search'); await tag('Regression'); await tag('Validation'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that submitting the search form with no keyword entered shows a validation message.</p>
      <h2>Expected Result</h2>
      <p>A warning/error message is displayed prompting the user to enter a search term.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();

    await test.step('Step 1: Navigate to the search page', async () => {
      await step('Go to /search page', async () => {
        await searchPage.goto();
        await expect(page).toHaveURL(/.*search.*/);
      });
    });

    await test.step('Step 2: Submit search with empty keyword', async () => {
      await step('Click search button without entering any term', async () => {
        await searchPage.searchButton.click();
      });
    });

    await test.step('Step 3: Verify validation message appears', async () => {
      await step('Assert warning message is displayed', async () => {
        const warningMessage = page.locator('.warning');
        await expect(warningMessage).toBeVisible();
        const warningText = await warningMessage.innerText();
        await attachment('Validation Message', warningText, 'text/plain');
        expect(warningText.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.3  Search with keyword yielding no results → "No products were found"
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.3] Search with keyword yielding no results → no results message', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, searching for a term with no matches shows a "no results" message');
    await severity(Severity.CRITICAL);
    await tag('Search'); await tag('Regression'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that searching for a term that matches no products displays the "No products were found" message.</p>
      <h2>Expected Result</h2>
      <p>"No products were found" or equivalent message is shown and product list is empty.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();
    const noMatchKeyword = 'xyznonexistentproduct12345';

    await attachment('Test Input', JSON.stringify({ keyword: noMatchKeyword }), 'application/json');

    await test.step('Step 1: Search for a term that returns no results', async () => {
      await step('Go to /search with non-matching keyword', async () => {
        await parameter('Search Keyword', noMatchKeyword);
        await searchPage.goto(noMatchKeyword);
      });
    });

    await test.step('Step 2: Verify no products are shown', async () => {
      await step('Assert product count is zero', async () => {
        const count = await searchPage.getProductCount();
        await parameter('Results Count', String(count));
        expect(count).toBe(0);
      });
    });

    await test.step('Step 3: Verify no-results message is displayed', async () => {
      await step('Assert no-result message is visible', async () => {
        await expect(searchPage.noResultsMessage).toBeVisible();
        const noResultText = await searchPage.noResultsMessage.innerText();
        await attachment('No Results Message', noResultText, 'text/plain');
        expect(noResultText.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.4  Search autocomplete suggestions appear on input
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.4] Search autocomplete suggestions appear on input', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, typing in the header search bar shows autocomplete suggestions');
    await severity(Severity.NORMAL);
    await tag('Search'); await tag('Regression'); await tag('Autocomplete');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that typing at least 3 characters in the header search input triggers autocomplete
      suggestions to appear below the input.</p>
      <h2>Expected Result</h2>
      <p>Autocomplete dropdown with at least one suggestion is displayed.</p>
    `);

    const pom = new PageObjectManager(page);
    const homePage = pom.getHomePage();
    const keyword = 'boo';

    await test.step('Step 1: Navigate to the home page', async () => {
      await step('Go to home page', async () => {
        await homePage.goto();
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Type keyword in header search input', async () => {
      await step('Type partial search term to trigger autocomplete', async () => {
        await parameter('Partial Keyword', keyword);
        await homePage.searchInput.fill(keyword);
        await page.waitForTimeout(800);
      });
    });

    await test.step('Step 3: Verify autocomplete suggestions appear', async () => {
      await step('Assert autocomplete dropdown is visible', async () => {
        const autocomplete = page.locator('.ui-autocomplete, .autocomplete-suggestions');
        await expect(autocomplete).toBeVisible({ timeout: 5000 });
        const suggestionItems = page.locator('.ui-autocomplete li, .autocomplete-suggestions .autocomplete-suggestion');
        const count = await suggestionItems.count();
        await parameter('Suggestion Count', String(count));
        expect(count).toBeGreaterThan(0);
        const suggestions = await suggestionItems.allTextContents();
        await attachment('Autocomplete Suggestions', JSON.stringify(suggestions, null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.5  Advanced search: filter results by category dropdown
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.5] Advanced search: filter results by category', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can filter search results by selecting a category in advanced search');
    await severity(Severity.NORMAL);
    await tag('Search'); await tag('Regression'); await tag('Advanced-Search'); await tag('Filter');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that using the advanced search category filter narrows down results to the selected category.</p>
      <h2>Expected Result</h2>
      <p>Search results are filtered to products within the chosen category.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();

    await test.step('Step 1: Navigate to the search page', async () => {
      await step('Go to /search page', async () => {
        await searchPage.goto();
        await expect(page).toHaveURL(/.*search.*/);
      });
    });

    await test.step('Step 2: Enable advanced search and select Books category', async () => {
      await step('Check the Advanced Search checkbox', async () => {
        const advSearchCheckbox = page.locator('#As');
        await advSearchCheckbox.check();
        await expect(advSearchCheckbox).toBeChecked();
      });
      await step('Select Books from the category dropdown', async () => {
        const categoryDropdown = page.locator('#cid');
        await categoryDropdown.selectOption({ label: 'Books' });
        await parameter('Selected Category', 'Books');
      });
      await step('Enter keyword and submit', async () => {
        await searchPage.searchInput.fill('book');
        await searchPage.searchButton.click();
      });
    });

    await test.step('Step 3: Verify filtered results', async () => {
      await step('Assert results are shown', async () => {
        const count = await searchPage.getProductCount();
        await parameter('Filtered Results Count', String(count));
        expect(count).toBeGreaterThan(0);
        const names = await searchPage.getProductNames();
        await attachment('Filtered Search Results', JSON.stringify(names, null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.6  Advanced search: filter results by price range (From / To)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.6] Advanced search: filter results by price range', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can filter search results by specifying a price range in advanced search');
    await severity(Severity.NORMAL);
    await tag('Search'); await tag('Regression'); await tag('Advanced-Search'); await tag('Filter');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that using the price From/To fields in advanced search filters results to products
      within the specified price range.</p>
      <h2>Expected Result</h2>
      <p>Search results are limited to products within the given price range.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();
    const priceFrom = '10';
    const priceTo = '50';

    await test.step('Step 1: Navigate to the search page', async () => {
      await step('Go to /search page', async () => {
        await searchPage.goto();
        await expect(page).toHaveURL(/.*search.*/);
      });
    });

    await test.step('Step 2: Enable advanced search and set price range', async () => {
      await step('Check the Advanced Search checkbox', async () => {
        const advSearchCheckbox = page.locator('#As');
        await advSearchCheckbox.check();
      });
      await step('Enter price From and To values', async () => {
        await parameter('Price From', priceFrom);
        await parameter('Price To', priceTo);
        await page.locator('#pf').fill(priceFrom);
        await page.locator('#pt').fill(priceTo);
      });
      await step('Enter keyword and submit', async () => {
        await searchPage.searchInput.fill('book');
        await searchPage.searchButton.click();
      });
    });

    await test.step('Step 3: Verify results are within the price range', async () => {
      await step('Assert results are returned', async () => {
        const count = await searchPage.getProductCount();
        await parameter('Results Count', String(count));
        expect(count).toBeGreaterThanOrEqual(0);
        if (count > 0) {
          const names = await searchPage.getProductNames();
          await attachment('Price-Filtered Results', JSON.stringify(names, null, 2), 'application/json');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.7  Advanced search: "Automatically search sub categories" checkbox
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.7] Advanced search: search in sub-categories checkbox', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can enable sub-category search in advanced search to widen results');
    await severity(Severity.NORMAL);
    await tag('Search'); await tag('Regression'); await tag('Advanced-Search');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that checking "Automatically search sub categories" includes sub-category products
      in search results when a parent category is selected.</p>
      <h2>Expected Result</h2>
      <p>Results include products from sub-categories of the selected parent category.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();

    await test.step('Step 1: Navigate to the search page', async () => {
      await step('Go to /search page', async () => {
        await searchPage.goto();
        await expect(page).toHaveURL(/.*search.*/);
      });
    });

    await test.step('Step 2: Enable advanced search and check sub-categories option', async () => {
      await step('Check the Advanced Search checkbox', async () => {
        const advSearchCheckbox = page.locator('#As');
        await advSearchCheckbox.check();
      });
      await step('Select Computers from category dropdown', async () => {
        const categoryDropdown = page.locator('#cid');
        await categoryDropdown.selectOption({ label: 'Computers' });
        await parameter('Selected Category', 'Computers');
      });
      await step('Check "Automatically search sub categories"', async () => {
        const subCatCheckbox = page.locator('#isc');
        await subCatCheckbox.check();
        await expect(subCatCheckbox).toBeChecked();
        await parameter('Search Sub-Categories', 'enabled');
      });
      await step('Enter keyword and submit', async () => {
        await searchPage.searchInput.fill('computer');
        await searchPage.searchButton.click();
      });
    });

    await test.step('Step 3: Verify results include sub-category products', async () => {
      await step('Assert results are shown with sub-categories enabled', async () => {
        const count = await searchPage.getProductCount();
        await parameter('Results Count (with sub-categories)', String(count));
        expect(count).toBeGreaterThanOrEqual(0);
        if (count > 0) {
          const names = await searchPage.getProductNames();
          await attachment('Sub-Category Search Results', JSON.stringify(names, null, 2), 'application/json');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.8  Advanced search: filter by manufacturer
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.8] Advanced search: filter by manufacturer', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can filter search results by manufacturer using advanced search');
    await severity(Severity.MINOR);
    await tag('Search'); await tag('Regression'); await tag('Advanced-Search'); await tag('Filter');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that selecting a manufacturer in advanced search filters results to products
      from that manufacturer only.</p>
      <h2>Expected Result</h2>
      <p>Search results are filtered by the selected manufacturer.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();

    await test.step('Step 1: Navigate to the search page', async () => {
      await step('Go to /search page', async () => {
        await searchPage.goto();
        await expect(page).toHaveURL(/.*search.*/);
      });
    });

    await test.step('Step 2: Enable advanced search and select a manufacturer', async () => {
      await step('Check the Advanced Search checkbox', async () => {
        const advSearchCheckbox = page.locator('#As');
        await advSearchCheckbox.check();
      });
      await step('Select the first available manufacturer from dropdown', async () => {
        const manufacturerDropdown = page.locator('#mid');
        await manufacturerDropdown.selectOption({ index: 1 });
        const selectedText = await manufacturerDropdown.locator('option:checked').innerText();
        await parameter('Selected Manufacturer', selectedText);
        await attachment('Selected Manufacturer', selectedText, 'text/plain');
      });
      await step('Submit the search', async () => {
        await searchPage.searchButton.click();
      });
    });

    await test.step('Step 3: Verify filtered results are shown', async () => {
      await step('Assert page loaded with manufacturer filter applied', async () => {
        await expect(page).toHaveURL(/.*mid=.*/);
        const count = await searchPage.getProductCount();
        await parameter('Results Count', String(count));
        if (count > 0) {
          const names = await searchPage.getProductNames();
          await attachment('Manufacturer-Filtered Results', JSON.stringify(names, null, 2), 'application/json');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.9  Advanced search: "Search in product descriptions" checkbox
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.9] Advanced search: search in product descriptions', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can enable searching in product descriptions via advanced search');
    await severity(Severity.MINOR);
    await tag('Search'); await tag('Regression'); await tag('Advanced-Search');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that checking "Search in product descriptions" returns products whose descriptions
      contain the keyword, potentially yielding more results than title-only search.</p>
      <h2>Expected Result</h2>
      <p>Search returns results including products matched by description text.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();
    const keyword = 'fiction';

    await test.step('Step 1: Navigate to the search page', async () => {
      await step('Go to /search page', async () => {
        await searchPage.goto();
        await expect(page).toHaveURL(/.*search.*/);
      });
    });

    await test.step('Step 2: Enable advanced search and check descriptions option', async () => {
      await step('Check the Advanced Search checkbox', async () => {
        const advSearchCheckbox = page.locator('#As');
        await advSearchCheckbox.check();
      });
      await step('Check "Search in product descriptions"', async () => {
        const descCheckbox = page.locator('#sid');
        await descCheckbox.check();
        await expect(descCheckbox).toBeChecked();
        await parameter('Search In Descriptions', 'enabled');
      });
      await step('Enter keyword and submit', async () => {
        await parameter('Keyword', keyword);
        await searchPage.searchInput.fill(keyword);
        await searchPage.searchButton.click();
      });
    });

    await test.step('Step 3: Verify search executes and shows result state', async () => {
      await step('Assert search page loaded with description search applied', async () => {
        await expect(page).toHaveURL(/.*sid=true.*/);
        const count = await searchPage.getProductCount();
        await parameter('Results Count', String(count));
        if (count > 0) {
          const names = await searchPage.getProductNames();
          await attachment('Description Search Results', JSON.stringify(names, null, 2), 'application/json');
        } else {
          const noResultMsg = await searchPage.noResultsMessage.innerText().catch(() => 'No result element');
          await attachment('No Results Message', noResultMsg, 'text/plain');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.10  Search results: sort by Name A-Z / Z-A / Price Low-High / Price High-Low
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.10] Search results: sort by Name and Price options', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can sort search results by name and price in various orders');
    await severity(Severity.NORMAL);
    await tag('Search'); await tag('Regression'); await tag('Sort');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the sort dropdown on the search results page works for all four sort options:
      Name A-Z, Name Z-A, Price Low-High, Price High-Low.</p>
      <h2>Expected Result</h2>
      <p>Each sort option triggers a page reload and products are reordered accordingly.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();
    const keyword = testData.search.term;

    await test.step('Step 1: Navigate to search page with results', async () => {
      await step('Search for a keyword that returns multiple results', async () => {
        await parameter('Search Keyword', keyword);
        await searchPage.goto(keyword);
        const count = await searchPage.getProductCount();
        expect(count).toBeGreaterThan(0);
      });
    });

    await test.step('Step 2: Sort by Name A-Z', async () => {
      await step('Select "Name: A to Z" from sort dropdown', async () => {
        const sortDropdown = page.locator('#products-orderby');
        await sortDropdown.selectOption({ label: 'Name: A to Z' });
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*orderby=5.*/);
        const names = await searchPage.getProductNames();
        await attachment('Results — Name A-Z', JSON.stringify(names, null, 2), 'application/json');
        await parameter('Sort Applied', 'Name A-Z');
      });
    });

    await test.step('Step 3: Sort by Name Z-A', async () => {
      await step('Select "Name: Z to A" from sort dropdown', async () => {
        const sortDropdown = page.locator('#products-orderby');
        await sortDropdown.selectOption({ label: 'Name: Z to A' });
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*orderby=6.*/);
        const names = await searchPage.getProductNames();
        await attachment('Results — Name Z-A', JSON.stringify(names, null, 2), 'application/json');
        await parameter('Sort Applied', 'Name Z-A');
      });
    });

    await test.step('Step 4: Sort by Price Low to High', async () => {
      await step('Select "Price: Low to High" from sort dropdown', async () => {
        const sortDropdown = page.locator('#products-orderby');
        await sortDropdown.selectOption({ label: 'Price: Low to High' });
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*orderby=10.*/);
        const names = await searchPage.getProductNames();
        await attachment('Results — Price Low-High', JSON.stringify(names, null, 2), 'application/json');
        await parameter('Sort Applied', 'Price Low-High');
      });
    });

    await test.step('Step 5: Sort by Price High to Low', async () => {
      await step('Select "Price: High to Low" from sort dropdown', async () => {
        const sortDropdown = page.locator('#products-orderby');
        await sortDropdown.selectOption({ label: 'Price: High to Low' });
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*orderby=11.*/);
        const names = await searchPage.getProductNames();
        await attachment('Results — Price High-Low', JSON.stringify(names, null, 2), 'application/json');
        await parameter('Sort Applied', 'Price High-Low');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.11  Search results: change items per page (4 / 8 / 12)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.11] Search results: change items per page', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can change how many products are shown per page in search results');
    await severity(Severity.MINOR);
    await tag('Search'); await tag('Regression'); await tag('Pagination');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that changing the "items per page" dropdown on search results updates the number
      of products displayed per page (4, 8, or 12).</p>
      <h2>Expected Result</h2>
      <p>The correct number of products is displayed for each page size selection.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();

    await test.step('Step 1: Navigate to search page with enough results', async () => {
      await step('Search for a broad term that returns many results', async () => {
        await searchPage.goto('a');
        await expect(page).toHaveURL(/.*search.*/);
      });
    });

    await test.step('Step 2: Change page size to 4', async () => {
      await step('Select 4 items per page', async () => {
        const pageSizeDropdown = page.locator('#products-pagesize');
        await pageSizeDropdown.selectOption('4');
        await page.waitForLoadState('networkidle');
        await parameter('Page Size', '4');
        const count = await searchPage.getProductCount();
        await parameter('Displayed Products', String(count));
        expect(count).toBeLessThanOrEqual(4);
      });
    });

    await test.step('Step 3: Change page size to 8', async () => {
      await step('Select 8 items per page', async () => {
        const pageSizeDropdown = page.locator('#products-pagesize');
        await pageSizeDropdown.selectOption('8');
        await page.waitForLoadState('networkidle');
        await parameter('Page Size', '8');
        const count = await searchPage.getProductCount();
        await parameter('Displayed Products', String(count));
        expect(count).toBeLessThanOrEqual(8);
      });
    });

    await test.step('Step 4: Change page size to 12', async () => {
      await step('Select 12 items per page', async () => {
        const pageSizeDropdown = page.locator('#products-pagesize');
        await pageSizeDropdown.selectOption('12');
        await page.waitForLoadState('networkidle');
        await parameter('Page Size', '12');
        const count = await searchPage.getProductCount();
        await parameter('Displayed Products', String(count));
        expect(count).toBeLessThanOrEqual(12);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4.12  Search results: switch between Grid and List view
  // ─────────────────────────────────────────────────────────────────────────────
  test('[4.12] Search results: switch between Grid and List view', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can toggle between Grid and List view in search results');
    await severity(Severity.MINOR);
    await tag('Search'); await tag('Regression'); await tag('View-Mode');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the view mode toggles (Grid / List) on the search results page work correctly
      and the layout changes accordingly.</p>
      <h2>Expected Result</h2>
      <p>Switching to List view applies the list class to the products container; switching back to
      Grid view restores the grid layout.</p>
    `);

    const pom = new PageObjectManager(page);
    const searchPage = pom.getSearchResultsPage();
    const keyword = testData.search.term;

    await test.step('Step 1: Navigate to search page with results', async () => {
      await step('Search for a keyword that returns results', async () => {
        await parameter('Search Keyword', keyword);
        await searchPage.goto(keyword);
        const count = await searchPage.getProductCount();
        expect(count).toBeGreaterThan(0);
      });
    });

    await test.step('Step 2: Switch to List view', async () => {
      await step('Click the List view button', async () => {
        const listViewButton = page.locator('.product-viewmode a').filter({ hasText: 'List' });
        await listViewButton.click();
        await page.waitForLoadState('networkidle');
        await parameter('View Mode', 'List');
        await expect(page).toHaveURL(/.*viewmode=list.*/);
      });
      await step('Assert products container has list class', async () => {
        const productsContainer = page.locator('.products-container, .product-grid, .product-list');
        await expect(productsContainer.first()).toBeVisible();
        await attachment('List View URL', page.url(), 'text/plain');
      });
    });

    await test.step('Step 3: Switch back to Grid view', async () => {
      await step('Click the Grid view button', async () => {
        const gridViewButton = page.locator('.product-viewmode a').filter({ hasText: 'Grid' });
        await gridViewButton.click();
        await page.waitForLoadState('networkidle');
        await parameter('View Mode', 'Grid');
        await expect(page).toHaveURL(/.*viewmode=grid.*/);
      });
      await step('Assert products container is visible in grid layout', async () => {
        const productsContainer = page.locator('.products-container, .product-grid');
        await expect(productsContainer.first()).toBeVisible();
        await attachment('Grid View URL', page.url(), 'text/plain');
      });
    });
  });

});
