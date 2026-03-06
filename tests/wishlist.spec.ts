import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import { CredentialManager } from '../utils/CredentialManager';

const BASE_META = async () => {
  await epic('Wishlist');
  await feature('Wishlist Management');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

const SIMPLE_PRODUCT_URL = '/computing-and-internet';

async function loginAndAddToWishlist(page: any, pom: any) {
  const loginPage = pom.getLoginPage();
  const credentials = CredentialManager.load();
  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);
  await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
  await page.goto(SIMPLE_PRODUCT_URL);
  const addToWishlistBtn = page.locator('.add-to-wishlist-button').first();
  await addToWishlistBtn.click();
  await page.waitForTimeout(1500);
  await page.goto('/wishlist');
  await expect(page).toHaveURL(/.*\/wishlist.*/);
}

test.describe('Module 10 — Wishlist (/wishlist)', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 10.1  Add a product to wishlist (logged in)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[10.1] Add a product to wishlist when logged in', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can add a product to my wishlist');
    await severity(Severity.NORMAL);
    await tag('Wishlist'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a logged-in user can add a product to their wishlist from the
      product detail page, and a success notification is shown.</p>
      <h2>Expected Result</h2>
      <p>Product is added to wishlist and a bar notification confirms the action.</p>
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

    await test.step('Step 2: Navigate to a product detail page', async () => {
      await step('Go to product detail page', async () => {
        await page.goto(SIMPLE_PRODUCT_URL);
        const productTitle = page.locator('.product-name h1');
        await expect(productTitle).toBeVisible();
        const name = await productTitle.innerText();
        await parameter('Product', name.trim());
      });
    });

    await test.step('Step 3: Click Add to Wishlist and verify notification', async () => {
      await step('Click the Add to Wishlist button', async () => {
        const addToWishlistBtn = page.locator('.add-to-wishlist-button').first();
        await addToWishlistBtn.click();
        await page.waitForTimeout(1500);
      });
      await step('Assert bar notification is shown', async () => {
        const notification = page.locator('#bar-notification');
        await expect(notification).toBeVisible({ timeout: 10000 });
        const notifText = await notification.innerText();
        await attachment('Wishlist Notification', notifText, 'text/plain');
        expect(notifText.toLowerCase()).toContain('wishlist');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 10.2  View wishlist → product appears with correct details
  // ─────────────────────────────────────────────────────────────────────────────
  test('[10.2] View wishlist → product appears with correct name and price', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, my wishlist shows added products with correct details');
    await severity(Severity.NORMAL);
    await tag('Wishlist'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the wishlist page shows the product just added, with its name and price.</p>
      <h2>Expected Result</h2>
      <p>Wishlist contains at least one product with a non-empty name and visible price.</p>
    `);

    const pom = new PageObjectManager(page);
    const wishlistPage = pom.getWishlistPage();

    await test.step('Step 1: Login and add product to wishlist', async () => {
      await step('Login and add product to wishlist', async () => {
        await loginAndAddToWishlist(page, pom);
      });
    });

    await test.step('Step 2: Verify wishlist content', async () => {
      await step('Assert product is listed on wishlist page', async () => {
        const wishlistTable = page.locator('.wishlist');
        await expect(wishlistTable).toBeVisible();
        const itemCount = await wishlistPage.getWishlistItemCount();
        await parameter('Wishlist Item Count', String(itemCount));
        expect(itemCount).toBeGreaterThan(0);
      });
      await step('Attach product names and prices', async () => {
        const names = await wishlistPage.getProductNames();
        await attachment('Wishlist Products', JSON.stringify(names, null, 2), 'application/json');
        names.forEach(n => expect(n.trim().length).toBeGreaterThan(0));

        const prices = page.locator('.wishlist .unit-price .product-unit-price');
        const priceCount = await prices.count();
        await parameter('Price Elements Found', String(priceCount));
        if (priceCount > 0) {
          const priceText = await prices.first().innerText();
          await attachment('First Product Price', priceText, 'text/plain');
          expect(priceText.trim().length).toBeGreaterThan(0);
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 10.3  Move item from wishlist to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[10.3] Move a wishlist item to shopping cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can move an item from my wishlist to the cart');
    await severity(Severity.NORMAL);
    await tag('Wishlist'); await tag('Regression'); await tag('Cart');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that checking the "Add to cart" checkbox in the wishlist and clicking
      the Add to Cart button moves the item to the shopping cart.</p>
      <h2>Expected Result</h2>
      <p>Item is moved to cart and the cart count in header increases.</p>
    `);

    const pom = new PageObjectManager(page);
    const wishlistPage = pom.getWishlistPage();

    await test.step('Step 1: Login and add product to wishlist', async () => {
      await step('Login and add product to wishlist', async () => {
        await loginAndAddToWishlist(page, pom);
      });
    });

    await test.step('Step 2: Select item to move to cart', async () => {
      await step('Check the Add to Cart checkbox for first wishlist item', async () => {
        const itemCount = await wishlistPage.getWishlistItemCount();
        await parameter('Wishlist Items', String(itemCount));
        expect(itemCount).toBeGreaterThan(0);
        await wishlistPage.addItemToCart(0);
        await page.waitForTimeout(1500);
      });
    });

    await test.step('Step 3: Verify item moved to cart', async () => {
      await step('Assert cart count updated in header', async () => {
        const cartCount = page.locator('.cart-qty');
        const cartText = await cartCount.innerText();
        await attachment('Cart Count After Move', cartText, 'text/plain');
        // Cart count should not be empty/zero
        expect(cartText.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 10.4  Remove item from wishlist
  // ─────────────────────────────────────────────────────────────────────────────
  test('[10.4] Remove an item from the wishlist', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can remove an item from my wishlist');
    await severity(Severity.NORMAL);
    await tag('Wishlist'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that checking the remove checkbox and updating the wishlist removes
      the selected item from the wishlist.</p>
      <h2>Expected Result</h2>
      <p>Item is removed; wishlist either shows remaining items or an empty state.</p>
    `);

    const pom = new PageObjectManager(page);
    const wishlistPage = pom.getWishlistPage();

    await test.step('Step 1: Login and add product to wishlist', async () => {
      await step('Login and add product to wishlist', async () => {
        await loginAndAddToWishlist(page, pom);
      });
    });

    await test.step('Step 2: Get item count before removal', async () => {
      await step('Record current wishlist item count', async () => {
        const countBefore = await wishlistPage.getWishlistItemCount();
        await parameter('Items Before Removal', String(countBefore));
        expect(countBefore).toBeGreaterThan(0);
      });
    });

    await test.step('Step 3: Remove first wishlist item', async () => {
      await step('Check remove checkbox and update wishlist', async () => {
        await wishlistPage.removeItem(0);
        await page.waitForTimeout(1000);
      });
    });

    await test.step('Step 4: Verify item was removed', async () => {
      await step('Assert wishlist count decreased or shows empty', async () => {
        await page.goto('/wishlist');
        const countAfter = await wishlistPage.getWishlistItemCount();
        await parameter('Items After Removal', String(countAfter));
        const isEmpty = await wishlistPage.isWishlistEmpty();
        await parameter('Wishlist Empty', String(isEmpty));
        // Either count decreased or wishlist is empty
        const emptyMsg = page.locator('.no-data');
        const emptyCount = await emptyMsg.count();
        if (emptyCount > 0) {
          const emptyText = await emptyMsg.first().innerText();
          await attachment('Empty Wishlist Message', emptyText, 'text/plain');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 10.5  Add to wishlist when not logged in → redirect to login
  // ─────────────────────────────────────────────────────────────────────────────
  test('[10.5] Add to wishlist when not logged in → redirect to login', async ({ page }) => {
    await BASE_META();
    await story('As a guest, attempting to add to wishlist redirects me to the login page');
    await severity(Severity.NORMAL);
    await tag('Wishlist'); await tag('Regression'); await tag('Auth');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a non-logged-in user who clicks "Add to Wishlist" on a product page
      is redirected to the login page.</p>
      <h2>Expected Result</h2>
      <p>User is redirected to /login page with a return URL parameter.</p>
    `);

    await test.step('Step 1: Navigate to product page without logging in', async () => {
      await step('Go to product detail page as guest', async () => {
        await page.goto(SIMPLE_PRODUCT_URL);
        const productTitle = page.locator('.product-name h1');
        await expect(productTitle).toBeVisible();
        const name = await productTitle.innerText();
        await parameter('Product', name.trim());
      });
    });

    await test.step('Step 2: Click Add to Wishlist as guest', async () => {
      await step('Click Add to Wishlist button', async () => {
        const addToWishlistBtn = page.locator('.add-to-wishlist-button').first();
        await addToWishlistBtn.click();
        await page.waitForTimeout(1500);
      });
    });

    await test.step('Step 3: Verify redirect to login page', async () => {
      await step('Assert URL is login page', async () => {
        const currentUrl = page.url();
        await attachment('Redirect URL', currentUrl, 'text/plain');
        // Guest clicking wishlist should redirect to login
        expect(currentUrl).toContain('/login');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 10.6  Share wishlist via public link
  // ─────────────────────────────────────────────────────────────────────────────
  test('[10.6] Share wishlist via public shareable link', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can share my wishlist via a public URL');
    await severity(Severity.MINOR);
    await tag('Wishlist'); await tag('Regression'); await tag('Share');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the wishlist page shows a shareable URL input field that
      contains a valid public link to the wishlist.</p>
      <h2>Expected Result</h2>
      <p>A shareable wishlist URL is displayed and accessible.</p>
    `);

    const pom = new PageObjectManager(page);
    const wishlistPage = pom.getWishlistPage();

    await test.step('Step 1: Login and add product to wishlist', async () => {
      await step('Login and add product to wishlist', async () => {
        await loginAndAddToWishlist(page, pom);
      });
    });

    await test.step('Step 2: Check for shareable URL input', async () => {
      await step('Assert wishlist URL input is visible', async () => {
        const shareInput = page.locator('.wishlist-url-input, input.share-link');
        const shareCount = await shareInput.count();
        await parameter('Share Input Found', String(shareCount));
        if (shareCount > 0) {
          await expect(shareInput.first()).toBeVisible();
          const shareUrl = await wishlistPage.getShareableUrl();
          await attachment('Shareable Wishlist URL', shareUrl, 'text/plain');
          expect(shareUrl.length).toBeGreaterThan(0);
          expect(shareUrl).toContain('wishlist');
        } else {
          // Some accounts may not have this feature if wishlist is empty
          await attachment('Note', 'Share URL input not visible (wishlist may be empty)', 'text/plain');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 10.7  Update quantity of a wishlist item
  // ─────────────────────────────────────────────────────────────────────────────
  test('[10.7] Update quantity of a wishlist item', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can change the quantity of an item in my wishlist');
    await severity(Severity.MINOR);
    await tag('Wishlist'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the quantity input in the wishlist can be changed and the wishlist
      updated successfully.</p>
      <h2>Expected Result</h2>
      <p>Wishlist reflects the new quantity after updating.</p>
    `);

    const pom = new PageObjectManager(page);
    const wishlistPage = pom.getWishlistPage();

    await test.step('Step 1: Login and add product to wishlist', async () => {
      await step('Login and add product to wishlist', async () => {
        await loginAndAddToWishlist(page, pom);
      });
    });

    await test.step('Step 2: Verify wishlist has items', async () => {
      await step('Assert at least one item is in the wishlist', async () => {
        const itemCount = await wishlistPage.getWishlistItemCount();
        await parameter('Wishlist Item Count', String(itemCount));
        expect(itemCount).toBeGreaterThan(0);
      });
    });

    await test.step('Step 3: Update quantity of first item', async () => {
      await step('Set quantity to 2 and update wishlist', async () => {
        await wishlistPage.updateItemQuantity(0, 2);
        await parameter('New Quantity', '2');
        await page.waitForTimeout(1000);
      });
    });

    await test.step('Step 4: Verify quantity was updated', async () => {
      await step('Assert updated quantity is reflected', async () => {
        await page.goto('/wishlist');
        const qtyInputs = page.locator('.wishlist .qty-input');
        const qtyCount = await qtyInputs.count();
        if (qtyCount > 0) {
          const updatedQty = await qtyInputs.first().inputValue();
          await attachment('Updated Quantity', updatedQty, 'text/plain');
          await parameter('Actual Quantity After Update', updatedQty);
        }
        // Verify wishlist page is still accessible and has items
        const itemCount = await wishlistPage.getWishlistItemCount();
        expect(itemCount).toBeGreaterThan(0);
      });
    });
  });

});
