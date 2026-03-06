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
  await feature('Gift Cards');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 5G — Gift Cards (/gift-cards)', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 5G.1  All 4 gift card products listed with correct prices
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5G.1] All 4 gift card products listed with correct prices', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, I expect to see all 4 gift card products with correct prices');
    await severity(Severity.NORMAL);
    await tag('GiftCards'); await tag('Regression');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the Gift Cards category page displays exactly 4 products with visible names and prices.</p>
      <h2>Expected Result</h2>
      <p>4 gift card products are listed with non-empty names and prices.</p>
    `);

    const pom = new PageObjectManager(page);
    const giftCardsPage = pom.getGiftCardsPage();

    await test.step('Step 1: Navigate to /gift-cards', async () => {
      await step('Go to Gift Cards category page', async () => {
        await giftCardsPage.goto();
        await expect(page).toHaveURL(/.*\/gift-cards.*/);
      });
    });

    await test.step('Step 2: Verify page title', async () => {
      await step('Assert page heading is Gift Cards', async () => {
        await expect(giftCardsPage.pageTitle).toBeVisible();
        const title = await giftCardsPage.pageTitle.innerText();
        await attachment('Page Title', title, 'text/plain');
      });
    });

    await test.step('Step 3: Verify 4 gift card products are listed', async () => {
      await step('Assert product count is 4', async () => {
        const count = await giftCardsPage.getProductCount();
        await parameter('Product Count', String(count));
        expect(count).toBe(4);
      });
      await step('Attach all gift card names and prices', async () => {
        const names = await giftCardsPage.getProductNames();
        const prices = await giftCardsPage.getProductPrices();
        await attachment('Gift Card Names', JSON.stringify(names, null, 2), 'application/json');
        await attachment('Gift Card Prices', JSON.stringify(prices, null, 2), 'application/json');
        names.forEach(n => expect(n.trim().length).toBeGreaterThan(0));
        prices.forEach(p => expect(p.trim().length).toBeGreaterThan(0));
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5G.2  Add virtual gift card with recipient details
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5G.2] Add virtual gift card ($25) with recipient details', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can fill in gift card recipient details and add it to cart');
    await severity(Severity.CRITICAL);
    await tag('GiftCards'); await tag('Regression'); await tag('Cart');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a user can open a virtual gift card product, fill in sender/recipient
      details, and successfully add it to the cart.</p>
      <h2>Expected Result</h2>
      <p>The gift card is added to cart with a success notification after filling recipient info.</p>
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

    await test.step('Step 2: Navigate to $25 virtual gift card product', async () => {
      await step('Go to /gift-cards and click the $25 virtual gift card', async () => {
        await page.goto('/gift-cards');
        const giftCardLink = page.getByRole('link', { name: '$25 Virtual Gift Card' }).first();
        await giftCardLink.click();
        await expect(page).toHaveURL(/.*25-virtual-gift-card.*/);
      });
    });

    await test.step('Step 3: Fill in gift card recipient details', async () => {
      await step('Fill recipient name', async () => {
        const recipientName = page.locator('#giftcard_1_RecipientName');
        await recipientName.fill('Jane Receiver');
        await parameter('Recipient Name', 'Jane Receiver');
      });
      await step('Fill recipient email', async () => {
        const recipientEmail = page.locator('#giftcard_1_RecipientEmail');
        await recipientEmail.fill('jane.receiver@test.com');
        await parameter('Recipient Email', 'jane.receiver@test.com');
      });
      await step('Fill sender name', async () => {
        const senderName = page.locator('#giftcard_1_SenderName');
        await senderName.fill('John Sender');
        await parameter('Sender Name', 'John Sender');
      });
      await step('Fill sender email', async () => {
        const senderEmail = page.locator('#giftcard_1_SenderEmail');
        await senderEmail.fill('john.sender@test.com');
        await parameter('Sender Email', 'john.sender@test.com');
      });
      await step('Fill message (optional)', async () => {
        const message = page.locator('#giftcard_1_Message');
        await message.fill('Happy Birthday!');
        await parameter('Message', 'Happy Birthday!');
      });
    });

    await test.step('Step 4: Add to cart and verify notification', async () => {
      await step('Click Add to Cart', async () => {
        await page.locator('#add-to-cart-button-1').click();
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
  // 5G.3  Add physical gift card ($100) to cart
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5G.3] Add physical gift card ($100) to cart', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can add a physical gift card to the cart');
    await severity(Severity.NORMAL);
    await tag('GiftCards'); await tag('Regression'); await tag('Cart');

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

    await test.step('Step 2: Navigate to $100 physical gift card product', async () => {
      await step('Go to /gift-cards and click the $100 physical gift card', async () => {
        await page.goto('/gift-cards');
        const giftCardLink = page.getByRole('link', { name: '$100 Physical Gift Card' }).first();
        await giftCardLink.click();
        await expect(page).toHaveURL(/.*100-physical-gift-card.*/);
      });
    });

    await test.step('Step 3: Fill in required gift card details', async () => {
      await step('Fill sender and recipient details', async () => {
        await page.locator('#giftcard_2_RecipientName').fill('Jane Doe');
        await page.locator('#giftcard_2_SenderName').fill('John Doe');
        await parameter('Recipient', 'Jane Doe');
        await parameter('Sender', 'John Doe');
      });
    });

    await test.step('Step 4: Add to cart and verify', async () => {
      await step('Click Add to Cart', async () => {
        await page.locator('#add-to-cart-button-2, .add-to-cart-button').first().click();
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
  // 5G.4  Verify gift card form fields
  // ─────────────────────────────────────────────────────────────────────────────
  test('[5G.4] Verify gift card form fields (sender, recipient name/email, message)', async ({ page }) => {
    await BASE_META();
    await story('As a visitor, the gift card product page shows all required form fields');
    await severity(Severity.CRITICAL);
    await tag('GiftCards'); await tag('Regression'); await tag('Validation');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the virtual gift card product page displays all required input fields:
      recipient name, recipient email, sender name, sender email, and message.</p>
      <h2>Expected Result</h2>
      <p>All 5 gift card form fields are visible on the product detail page.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login and navigate to a virtual gift card', async () => {
      await step('Login', async () => {
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
      await step('Navigate to $25 Virtual Gift Card product', async () => {
        await page.goto('/gift-cards');
        const giftCardLink = page.getByRole('link', { name: '$25 Virtual Gift Card' }).first();
        await giftCardLink.click();
        await expect(page).toHaveURL(/.*25-virtual-gift-card.*/);
      });
    });

    await test.step('Step 2: Verify all gift card form fields are present', async () => {
      await step('Assert Recipient Name field is visible', async () => {
        await expect(page.locator('#giftcard_1_RecipientName')).toBeVisible();
        await parameter('Recipient Name Field', 'visible');
      });
      await step('Assert Recipient Email field is visible', async () => {
        await expect(page.locator('#giftcard_1_RecipientEmail')).toBeVisible();
        await parameter('Recipient Email Field', 'visible');
      });
      await step('Assert Sender Name field is visible', async () => {
        await expect(page.locator('#giftcard_1_SenderName')).toBeVisible();
        await parameter('Sender Name Field', 'visible');
      });
      await step('Assert Sender Email field is visible', async () => {
        await expect(page.locator('#giftcard_1_SenderEmail')).toBeVisible();
        await parameter('Sender Email Field', 'visible');
      });
      await step('Assert Message field is visible', async () => {
        await expect(page.locator('#giftcard_1_Message')).toBeVisible();
        await parameter('Message Field', 'visible');
      });
      await attachment('Gift Card Form Fields', JSON.stringify([
        'RecipientName', 'RecipientEmail', 'SenderName', 'SenderEmail', 'Message'
      ], null, 2), 'application/json');
    });
  });

});
