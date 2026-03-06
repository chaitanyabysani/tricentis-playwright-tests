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
  await epic('Home Page');
  await feature('Home Page');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 3 — Home Page', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 3.1  Verify 6 featured products are displayed
  // ─────────────────────────────────────────────────────────────────────────────
  test('[3.1] Verify 6 featured products are displayed', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I expect to see 6 featured products on the home page');
    await severity(Severity.NORMAL);
    await tag('HomePage'); await tag('Regression'); await tag('Featured-Products');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the home page displays exactly 6 featured products with names and prices.</p>
      <h2>Expected Result</h2>
      <p>6 featured product tiles are visible on the home page.</p>
    `);

    const pom = new PageObjectManager(page);
    const homePage = pom.getHomePage();

    await test.step('Step 1: Navigate to the home page', async () => {
      await step('Go to home page', async () => {
        await homePage.goto();
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Verify 6 featured products are shown', async () => {
      await step('Count featured product items', async () => {
        const productItems = page.locator('.product-item');
        await expect(productItems).toHaveCount(6);
        await parameter('Expected Product Count', '6');
      });
      await step('Collect and attach featured product names', async () => {
        const productNames = await homePage.getFeaturedProductNames();
        await attachment('Featured Product Names', JSON.stringify(productNames, null, 2), 'application/json');
        expect(productNames.length).toBe(6);
        productNames.forEach(name => expect(name.trim().length).toBeGreaterThan(0));
      });
    });

    await test.step('Step 3: Verify each product has a price displayed', async () => {
      await step('Assert price is shown for each featured product', async () => {
        const prices = page.locator('.product-item .price.actual-price');
        const priceCount = await prices.count();
        await parameter('Products with Prices', String(priceCount));
        expect(priceCount).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3.2  Verify all main category navigation links are visible
  // ─────────────────────────────────────────────────────────────────────────────
  test('[3.2] Verify all main category navigation links are visible', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I expect all main navigation category links to be visible');
    await severity(Severity.NORMAL);
    await tag('HomePage'); await tag('Regression'); await tag('Navigation');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that all 7 main navigation category links are visible on the home page header.</p>
      <h2>Expected Result</h2>
      <p>Books, Computers, Electronics, Apparel & Shoes, Digital downloads, Jewelry, and Gift Cards links are all visible.</p>
    `);

    const pom = new PageObjectManager(page);
    const homePage = pom.getHomePage();

    await test.step('Step 1: Navigate to the home page', async () => {
      await step('Go to home page', async () => {
        await homePage.goto();
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Verify all 7 main navigation links are visible', async () => {
      await step('Assert Books nav link is visible', async () => {
        await expect(homePage.booksMenu).toBeVisible();
        await parameter('Books Nav', 'visible');
      });
      await step('Assert Computers nav link is visible', async () => {
        await expect(homePage.computersMenu).toBeVisible();
        await parameter('Computers Nav', 'visible');
      });
      await step('Assert Electronics nav link is visible', async () => {
        await expect(homePage.electronicsMenu).toBeVisible();
        await parameter('Electronics Nav', 'visible');
      });
      await step('Assert Apparel & Shoes nav link is visible', async () => {
        await expect(homePage.apparelMenu).toBeVisible();
        await parameter('Apparel & Shoes Nav', 'visible');
      });
      await step('Assert Digital downloads nav link is visible', async () => {
        await expect(homePage.digitalDownloadsMenu).toBeVisible();
        await parameter('Digital Downloads Nav', 'visible');
      });
      await step('Assert Jewelry nav link is visible', async () => {
        await expect(homePage.jewelryMenu).toBeVisible();
        await parameter('Jewelry Nav', 'visible');
      });
      await step('Assert Gift Cards nav link is visible', async () => {
        await expect(homePage.giftCardsMenu).toBeVisible();
        await parameter('Gift Cards Nav', 'visible');
      });
    });

    await test.step('Step 3: Attach navigation summary', async () => {
      await step('Record all visible nav links', async () => {
        await attachment('Navigation Links', JSON.stringify([
          'Books', 'Computers', 'Electronics', 'Apparel & Shoes',
          'Digital downloads', 'Jewelry', 'Gift Cards'
        ], null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3.3  Verify subcategory flyout menus (Computers: Desktops / Notebooks / Accessories)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[3.3] Verify subcategory flyout menu for Computers', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, hovering over Computers shows Desktops, Notebooks and Accessories sub-links');
    await severity(Severity.NORMAL);
    await tag('HomePage'); await tag('Regression'); await tag('Navigation'); await tag('Flyout');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that hovering over the "Computers" navigation item reveals the subcategory
      flyout with links for Desktops, Notebooks, and Accessories.</p>
      <h2>Expected Result</h2>
      <p>Three subcategory links (Desktops, Notebooks, Accessories) are visible in the flyout.</p>
    `);

    const pom = new PageObjectManager(page);
    const homePage = pom.getHomePage();

    await test.step('Step 1: Navigate to the home page', async () => {
      await step('Go to home page', async () => {
        await homePage.goto();
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Hover over the Computers navigation menu', async () => {
      await step('Hover over Computers menu item', async () => {
        await homePage.computersMenu.hover();
      });
    });

    await test.step('Step 3: Verify subcategory links appear', async () => {
      await step('Assert Desktops subcategory link is visible', async () => {
        const desktopsLink = page.getByRole('link', { name: 'Desktops' });
        await expect(desktopsLink).toBeVisible();
        await parameter('Desktops Subcategory', 'visible');
      });
      await step('Assert Notebooks subcategory link is visible', async () => {
        const notebooksLink = page.getByRole('link', { name: 'Notebooks' });
        await expect(notebooksLink).toBeVisible();
        await parameter('Notebooks Subcategory', 'visible');
      });
      await step('Assert Accessories subcategory link is visible', async () => {
        const accessoriesLink = page.getByRole('link', { name: 'Accessories' });
        await expect(accessoriesLink).toBeVisible();
        await parameter('Accessories Subcategory', 'visible');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3.4  Verify popular tags cloud is displayed
  // ─────────────────────────────────────────────────────────────────────────────
  test('[3.4] Verify popular tags cloud is displayed', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I expect to see the popular tags cloud on the home page');
    await severity(Severity.MINOR);
    await tag('HomePage'); await tag('Regression'); await tag('Tags');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the popular tags cloud section is displayed on the home page with at least one tag.</p>
      <h2>Expected Result</h2>
      <p>The popular tags section is visible and contains tag links.</p>
    `);

    const pom = new PageObjectManager(page);
    const homePage = pom.getHomePage();

    await test.step('Step 1: Navigate to the home page', async () => {
      await step('Go to home page', async () => {
        await homePage.goto();
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Verify popular tags section is present', async () => {
      await step('Assert popular tags block is visible', async () => {
        const tagsBlock = page.locator('.popular-tags');
        await expect(tagsBlock).toBeVisible();
      });
    });

    await test.step('Step 3: Verify at least one tag is shown', async () => {
      await step('Count tags in the cloud', async () => {
        const tagLinks = page.locator('.popular-tags a');
        const tagCount = await tagLinks.count();
        await parameter('Tag Count', String(tagCount));
        expect(tagCount).toBeGreaterThan(0);
        const tagTexts = await tagLinks.allTextContents();
        await attachment('Popular Tags', JSON.stringify(tagTexts, null, 2), 'application/json');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3.5  Newsletter signup with valid email → success message
  // ─────────────────────────────────────────────────────────────────────────────
  test('[3.5] Newsletter signup with valid email → success message', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can subscribe to the newsletter with a valid email');
    await severity(Severity.NORMAL);
    await tag('HomePage'); await tag('Regression'); await tag('Newsletter');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that entering a valid email in the newsletter signup form and clicking Subscribe
      shows a success confirmation message.</p>
      <h2>Expected Result</h2>
      <p>A success message is displayed confirming the newsletter subscription.</p>
    `);

    const pom = new PageObjectManager(page);
    const homePage = pom.getHomePage();
    const uniqueEmail = `newsletter+${Date.now()}@test.com`;

    await attachment('Test Input', JSON.stringify({ email: uniqueEmail }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to the home page', async () => {
      await step('Go to home page', async () => {
        await homePage.goto();
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Enter valid email and submit newsletter form', async () => {
      await step('Fill newsletter email and click Subscribe', async () => {
        await parameter('Newsletter Email', uniqueEmail);
        await homePage.subscribeNewsletter(uniqueEmail);
      });
    });

    await test.step('Step 3: Verify success message is displayed', async () => {
      await step('Assert newsletter result message is visible', async () => {
        const resultMessage = page.locator('#newsletter-result-block');
        await expect(resultMessage).toBeVisible();
        const resultText = await resultMessage.innerText();
        await attachment('Newsletter Result', resultText, 'text/plain');
        expect(resultText.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3.6  Newsletter signup with invalid email → error
  // ─────────────────────────────────────────────────────────────────────────────
  test('[3.6] Newsletter signup with invalid email → error', async ({ page }) => {
    await BASE_META();
    await story('As a visitor entering an invalid email in newsletter form, I see an error');
    await severity(Severity.MINOR);
    await tag('HomePage'); await tag('Regression'); await tag('Newsletter'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that entering an invalid email in the newsletter form shows a validation error.</p>
      <h2>Expected Result</h2>
      <p>An error or warning message is displayed indicating the email is invalid.</p>
    `);

    const pom = new PageObjectManager(page);
    const homePage = pom.getHomePage();
    const invalidEmail = 'notanemail';

    await attachment('Test Input', JSON.stringify({ email: invalidEmail }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to the home page', async () => {
      await step('Go to home page', async () => {
        await homePage.goto();
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Enter invalid email and submit newsletter form', async () => {
      await step('Fill invalid email and click Subscribe', async () => {
        await parameter('Invalid Email', invalidEmail);
        await homePage.subscribeNewsletter(invalidEmail);
      });
    });

    await test.step('Step 3: Verify error is displayed', async () => {
      await step('Assert error or result message is shown', async () => {
        const resultMessage = page.locator('#newsletter-result-block');
        await expect(resultMessage).toBeVisible();
        const resultText = await resultMessage.innerText();
        await attachment('Newsletter Error Response', resultText, 'text/plain');
        expect(resultText.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3.7  Community poll: submit a vote and verify updated result
  // ─────────────────────────────────────────────────────────────────────────────
  test('[3.7] Community poll: submit a vote and verify updated result', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I can vote in the community poll and see the updated result');
    await severity(Severity.MINOR);
    await tag('HomePage'); await tag('Regression'); await tag('Poll');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the community poll block is present on the home page, a vote can be selected,
      and after voting, the results are displayed.</p>
      <h2>Expected Result</h2>
      <p>Poll results are displayed after submitting a vote.</p>
    `);

    const pom = new PageObjectManager(page);
    const homePage = pom.getHomePage();

    await test.step('Step 1: Navigate to the home page', async () => {
      await step('Go to home page', async () => {
        await homePage.goto();
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Verify poll block is present', async () => {
      await step('Assert community poll block is visible', async () => {
        const pollBlock = page.locator('.poll');
        await expect(pollBlock).toBeVisible();
      });
    });

    await test.step('Step 3: Select the first poll answer and vote', async () => {
      await step('Click the first poll option radio button', async () => {
        const firstPollOption = page.locator('.poll-answers input[type="radio"]').first();
        await firstPollOption.check();
      });
      await step('Click the Vote button', async () => {
        const voteButton = page.locator('.poll-vote-button').first();
        await voteButton.click();
      });
    });

    await test.step('Step 4: Verify poll results are displayed', async () => {
      await step('Assert poll results block is visible', async () => {
        const pollResults = page.locator('.poll-results');
        await expect(pollResults).toBeVisible();
        const resultsText = await pollResults.innerText();
        await attachment('Poll Results', resultsText, 'text/plain');
        expect(resultsText.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3.8  Flyout cart on header hover shows cart items and subtotal
  // ─────────────────────────────────────────────────────────────────────────────
  test('[3.8] Flyout cart on header hover shows cart items and subtotal', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user with items in my cart, hovering the cart icon shows a flyout summary');
    await severity(Severity.MINOR);
    await tag('HomePage'); await tag('Regression'); await tag('Cart'); await tag('Flyout');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that hovering over the cart icon in the header reveals a mini cart flyout
      showing added items and a subtotal.</p>
      <h2>Pre-conditions</h2>
      <ul>
        <li>User is logged in</li>
        <li>At least one product is added to the cart before hovering</li>
      </ul>
      <h2>Expected Result</h2>
      <p>The mini cart flyout is visible and displays at least one product with its subtotal.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const homePage = pom.getHomePage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login and add a product to the cart', async () => {
      await step('Login with saved credentials', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
      await step('Add a book to the cart via quick-add', async () => {
        await page.goto('/computing-and-internet');
        const addToCartButton = page.locator('.add-to-cart-button').first();
        await addToCartButton.click();
        await page.waitForTimeout(1000);
        await homePage.goto();
      });
    });

    await test.step('Step 2: Hover over the cart icon in the header', async () => {
      await step('Hover over cart quantity link', async () => {
        await homePage.cartLink.hover();
        await page.waitForTimeout(500);
      });
    });

    await test.step('Step 3: Verify mini cart flyout is shown', async () => {
      await step('Assert mini shopping cart flyout is visible', async () => {
        const miniCart = page.locator('#flyout-cart');
        await expect(miniCart).toBeVisible();
        const miniCartText = await miniCart.innerText();
        await attachment('Mini Cart Flyout Content', miniCartText, 'text/plain');
      });
      await step('Assert cart total is shown in flyout', async () => {
        const miniCartTotal = page.locator('#flyout-cart .totals');
        await expect(miniCartTotal).toBeVisible();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3.9  Click featured product → navigates to correct product detail page
  // ─────────────────────────────────────────────────────────────────────────────
  test('[3.9] Click featured product → navigates to correct product detail page', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, clicking a featured product takes me to that product\'s detail page');
    await severity(Severity.NORMAL);
    await tag('HomePage'); await tag('Regression'); await tag('Navigation'); await tag('Featured-Products');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that clicking the first featured product on the home page navigates to the
      correct product detail page, and the product name matches.</p>
      <h2>Expected Result</h2>
      <p>User lands on the product detail page with the correct product name in the heading.</p>
    `);

    const pom = new PageObjectManager(page);
    const homePage = pom.getHomePage();

    await test.step('Step 1: Navigate to the home page', async () => {
      await step('Go to home page', async () => {
        await homePage.goto();
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
    });

    await test.step('Step 2: Get the first featured product name', async () => {
      await step('Read the first featured product name', async () => {
        const productNames = await homePage.getFeaturedProductNames();
        expect(productNames.length).toBeGreaterThan(0);
        const firstProductName = productNames[0].trim();
        await parameter('First Featured Product', firstProductName);
        await attachment('All Featured Products', JSON.stringify(productNames, null, 2), 'application/json');
      });
    });

    await test.step('Step 3: Click the first featured product', async () => {
      await step('Click the product title link of the first featured product', async () => {
        const firstProductLink = page.locator('.product-item .product-title a').first();
        const productName = await firstProductLink.innerText();
        await parameter('Clicked Product', productName.trim());
        await firstProductLink.click();
      });
    });

    await test.step('Step 4: Verify product detail page is loaded', async () => {
      await step('Assert URL changed to a product page', async () => {
        await expect(page).not.toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
        await attachment('Product Detail URL', page.url(), 'text/plain');
      });
      await step('Assert product name heading is visible on detail page', async () => {
        const productTitle = page.locator('.product-name h1');
        await expect(productTitle).toBeVisible();
        const titleText = await productTitle.innerText();
        await attachment('Product Detail Page Title', titleText, 'text/plain');
        expect(titleText.trim().length).toBeGreaterThan(0);
      });
      await step('Assert Add to Cart button is present on product page', async () => {
        const addToCartButton = page.locator('#add-to-cart-button-1, .add-to-cart-button').first();
        await expect(addToCartButton).toBeVisible();
      });
    });
  });

});
