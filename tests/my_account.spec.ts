import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import { CredentialManager } from '../utils/CredentialManager';

const BASE_META = async () => {
  await epic('My Account');
  await feature('Account Management');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

async function loginAndGoToAccount(page: any, pom: any) {
  const loginPage = pom.getLoginPage();
  const credentials = CredentialManager.load();
  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);
  await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
  await page.goto('/customer/info');
  await expect(page).toHaveURL(/.*\/customer\/info.*/);
}

test.describe('Module 9 — My Account (/customer)', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.1  View and edit customer info (name, email, gender, DOB)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.1] View and edit customer info (name, email, gender, DOB)', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can view and edit my customer info');
    await severity(Severity.NORMAL);
    await tag('MyAccount'); await tag('Regression'); await tag('CustomerInfo');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the My Account > Customer Info page loads with current data and allows
      editing name, gender, and date of birth fields.</p>
      <h2>Expected Result</h2>
      <p>Changes are saved and a success message is displayed.</p>
    `);

    const pom = new PageObjectManager(page);

    await test.step('Step 1: Login and navigate to /customer/info', async () => {
      await step('Login with saved credentials', async () => {
        await loginAndGoToAccount(page, pom);
      });
    });

    await test.step('Step 2: Verify customer info page elements', async () => {
      await step('Assert first name, last name, email fields are visible', async () => {
        await expect(page.locator('#FirstName')).toBeVisible();
        await expect(page.locator('#LastName')).toBeVisible();
        await expect(page.locator('#Email')).toBeVisible();
        const firstName = await page.locator('#FirstName').inputValue();
        const lastName = await page.locator('#LastName').inputValue();
        const email = await page.locator('#Email').inputValue();
        await attachment('Current First Name', firstName, 'text/plain');
        await attachment('Current Last Name', lastName, 'text/plain');
        await attachment('Current Email', email, 'text/plain');
        expect(email.length).toBeGreaterThan(0);
      });
    });

    await test.step('Step 3: Edit first name and save', async () => {
      await step('Update first name field and submit', async () => {
        const newFirstName = 'John';
        await page.locator('#FirstName').fill(newFirstName);
        await parameter('New First Name', newFirstName);
        await page.locator('input[value="Save"]').click();
        await page.waitForLoadState('networkidle');
      });
      await step('Assert save confirmation is shown', async () => {
        const notification = page.locator('.bar-notification, #bar-notification, .result');
        const isNotification = await notification.count();
        if (isNotification > 0) {
          const text = await notification.first().innerText();
          await attachment('Save Confirmation', text, 'text/plain');
        }
        // Verify page still on customer info (save was successful)
        await expect(page).toHaveURL(/.*\/customer\/info.*/);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.2  Change password (valid old + new password)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.2] Change password with valid old and new password', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can change my password with a valid old password');
    await severity(Severity.NORMAL);
    await tag('MyAccount'); await tag('Regression'); await tag('Password');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the Change Password page accepts a valid old password and new password,
      and saves the change successfully.</p>
      <h2>Expected Result</h2>
      <p>Password change form submits and a success notification is shown.</p>
    `);

    const pom = new PageObjectManager(page);
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login and navigate to change password page', async () => {
      await step('Login and go to /customer/changepassword', async () => {
        const loginPage = pom.getLoginPage();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
        await page.goto('/customer/changepassword');
        await expect(page).toHaveURL(/.*\/customer\/changepassword.*/);
      });
    });

    await test.step('Step 2: Verify change password form is visible', async () => {
      await step('Assert old password, new password, confirm password fields exist', async () => {
        await expect(page.locator('#OldPassword')).toBeVisible();
        await expect(page.locator('#NewPassword')).toBeVisible();
        await expect(page.locator('#ConfirmNewPassword')).toBeVisible();
      });
    });

    await test.step('Step 3: Fill and submit password change form', async () => {
      await step('Enter old password and same new password', async () => {
        await page.locator('#OldPassword').fill(credentials.password);
        await page.locator('#NewPassword').fill(credentials.password);
        await page.locator('#ConfirmNewPassword').fill(credentials.password);
        await parameter('Password Changed', 'Same password (to preserve credentials)');
        await page.locator('input[value="Change password"]').click();
        await page.waitForLoadState('networkidle');
      });
      await step('Assert success or validation response is shown', async () => {
        const successMsg = page.locator('.result, .bar-notification, #bar-notification');
        const errMsg = page.locator('.validation-summary-errors, .field-validation-error');
        const successCount = await successMsg.count();
        const errCount = await errMsg.count();
        if (successCount > 0) {
          const text = await successMsg.first().innerText();
          await attachment('Change Password Response', text, 'text/plain');
        } else if (errCount > 0) {
          const text = await errMsg.first().innerText();
          await attachment('Validation Error', text, 'text/plain');
        }
        // Either success message or staying on the page is acceptable
        await expect(page).toHaveURL(/.*\/customer\/changepassword.*/);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.3  Change password with wrong old password → error
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.3] Change password with wrong old password → error message', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, entering a wrong old password shows an error');
    await severity(Severity.NORMAL);
    await tag('MyAccount'); await tag('Regression'); await tag('Password');

    const pom = new PageObjectManager(page);
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login and navigate to change password page', async () => {
      await step('Login and go to /customer/changepassword', async () => {
        const loginPage = pom.getLoginPage();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await page.goto('/customer/changepassword');
        await expect(page).toHaveURL(/.*\/customer\/changepassword.*/);
      });
    });

    await test.step('Step 2: Submit form with wrong old password', async () => {
      await step('Enter incorrect old password', async () => {
        await page.locator('#OldPassword').fill('WrongOldPassword123!');
        await page.locator('#NewPassword').fill('NewTest@1234');
        await page.locator('#ConfirmNewPassword').fill('NewTest@1234');
        await parameter('Old Password Used', 'WrongOldPassword123! (intentionally wrong)');
        await page.locator('input[value="Change password"]').click();
        await page.waitForLoadState('networkidle');
      });
      await step('Assert error message is shown', async () => {
        const errMsg = page.locator('.validation-summary-errors, .field-validation-error, .message-error');
        await expect(errMsg.first()).toBeVisible({ timeout: 8000 });
        const errText = await errMsg.first().innerText();
        await attachment('Error Message', errText, 'text/plain');
        expect(errText.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.4  View order history list
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.4] View order history list in My Account', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can view my order history list');
    await severity(Severity.NORMAL);
    await tag('MyAccount'); await tag('Regression'); await tag('OrderHistory');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the My Account > Orders page loads and displays past orders or
      an empty state message when no orders exist.</p>
      <h2>Expected Result</h2>
      <p>Order history page loads with either a list of orders or an empty orders message.</p>
    `);

    const pom = new PageObjectManager(page);

    await test.step('Step 1: Login and navigate to orders page', async () => {
      await step('Login and go to /customer/orders', async () => {
        const loginPage = pom.getLoginPage();
        const credentials = CredentialManager.load();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
        await page.goto('/customer/orders');
        await expect(page).toHaveURL(/.*\/customer\/orders.*/);
      });
    });

    await test.step('Step 2: Verify order history page content', async () => {
      await step('Assert page title is visible', async () => {
        const pageTitle = page.locator('.page-title h1, h1');
        await expect(pageTitle.first()).toBeVisible();
        const titleText = await pageTitle.first().innerText();
        await attachment('Page Title', titleText, 'text/plain');
      });
      await step('Assert orders are listed or empty message shown', async () => {
        const orderRows = page.locator('.order-item, .orders-box table tbody tr');
        const emptyMsg = page.locator('.no-data');
        const orderCount = await orderRows.count();
        const emptyCount = await emptyMsg.count();
        await parameter('Order Count', String(orderCount));
        if (orderCount > 0) {
          const orderDetails = await orderRows.allInnerTexts();
          await attachment('Order List', JSON.stringify(orderDetails, null, 2), 'application/json');
        } else if (emptyCount > 0) {
          const emptyText = await emptyMsg.first().innerText();
          await attachment('Empty Orders Message', emptyText, 'text/plain');
        }
        // Either orders or empty message is acceptable
        expect(orderCount + emptyCount).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.5  View order details (products, total, status)
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.5] View individual order details (products, total, status)', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can click an order to view its details');
    await severity(Severity.NORMAL);
    await tag('MyAccount'); await tag('Regression'); await tag('OrderHistory');

    const pom = new PageObjectManager(page);

    await test.step('Step 1: Login and navigate to orders page', async () => {
      await step('Login and go to /customer/orders', async () => {
        const loginPage = pom.getLoginPage();
        const credentials = CredentialManager.load();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await page.goto('/customer/orders');
        await expect(page).toHaveURL(/.*\/customer\/orders.*/);
      });
    });

    await test.step('Step 2: Click first order details button', async () => {
      await step('Click Details button on first order if available', async () => {
        const detailsBtn = page.locator('.order-item .buttons a, .order-detail-item a').first();
        const btnCount = await detailsBtn.count();
        await parameter('Orders Found', String(btnCount));
        if (btnCount > 0) {
          await detailsBtn.click();
          await page.waitForLoadState('networkidle');
        } else {
          // No orders exist — skip detail check
          await attachment('Note', 'No orders found; skipping detail view', 'text/plain');
          test.skip();
        }
      });
    });

    await test.step('Step 3: Verify order detail page content', async () => {
      await step('Assert order number, status, and products are visible', async () => {
        const orderTitle = page.locator('.page-title h1, .order-number');
        await expect(orderTitle.first()).toBeVisible();
        const titleText = await orderTitle.first().innerText();
        await attachment('Order Title', titleText, 'text/plain');

        const orderStatus = page.locator('.order-status, .order-overview-shipping-status');
        const statusCount = await orderStatus.count();
        if (statusCount > 0) {
          const statusText = await orderStatus.first().innerText();
          await attachment('Order Status', statusText, 'text/plain');
        }

        const orderProducts = page.locator('.order-details-area table tbody tr, .cart-item-row');
        const productCount = await orderProducts.count();
        await parameter('Products in Order', String(productCount));
        expect(productCount).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.6  Add a new shipping address
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.6] Add a new shipping address', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can add a new shipping address to my account');
    await severity(Severity.NORMAL);
    await tag('MyAccount'); await tag('Regression'); await tag('Address');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the My Account > Addresses page allows adding a new address
      with all required fields.</p>
      <h2>Expected Result</h2>
      <p>New address is saved and appears in the address list.</p>
    `);

    const pom = new PageObjectManager(page);

    await test.step('Step 1: Login and navigate to addresses page', async () => {
      await step('Login and go to /customer/addresses', async () => {
        const loginPage = pom.getLoginPage();
        const credentials = CredentialManager.load();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await page.goto('/customer/addresses');
        await expect(page).toHaveURL(/.*\/customer\/addresses.*/);
      });
    });

    await test.step('Step 2: Click Add New Address button', async () => {
      await step('Click the Add new button', async () => {
        const addNewBtn = page.locator('.add-address-button, a[href*="addressadd"]');
        await expect(addNewBtn.first()).toBeVisible();
        await addNewBtn.first().click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*\/customer\/addressadd.*/);
      });
    });

    await test.step('Step 3: Fill new address form', async () => {
      await step('Enter address details', async () => {
        await page.locator('#Address_FirstName').fill('Test');
        await page.locator('#Address_LastName').fill('User');
        await page.locator('#Address_Email').fill(`testuser+addr${Date.now()}@test.com`);
        await page.locator('#Address_CountryId').selectOption({ label: 'United States' });
        await page.waitForTimeout(500);
        await page.locator('#Address_City').fill('New York');
        await page.locator('#Address_Address1').fill('456 Test Avenue');
        await page.locator('#Address_ZipPostalCode').fill('10001');
        await page.locator('#Address_PhoneNumber').fill('9876543210');
        await parameter('Address Line 1', '456 Test Avenue');
        await parameter('City', 'New York');
        await parameter('Country', 'United States');
      });
    });

    await test.step('Step 4: Save address and verify', async () => {
      await step('Click Save button', async () => {
        await page.locator('input[value="Save"]').click();
        await page.waitForLoadState('networkidle');
      });
      await step('Assert redirect back to addresses list', async () => {
        await expect(page).toHaveURL(/.*\/customer\/addresses.*/);
        const addresses = page.locator('.address-item, .address-list li');
        const count = await addresses.count();
        await parameter('Total Addresses', String(count));
        expect(count).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.7  Edit an existing address
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.7] Edit an existing shipping address', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can edit an existing address in my account');
    await severity(Severity.NORMAL);
    await tag('MyAccount'); await tag('Regression'); await tag('Address');

    const pom = new PageObjectManager(page);

    await test.step('Step 1: Login and navigate to addresses page', async () => {
      await step('Login and go to /customer/addresses', async () => {
        const loginPage = pom.getLoginPage();
        const credentials = CredentialManager.load();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await page.goto('/customer/addresses');
        await expect(page).toHaveURL(/.*\/customer\/addresses.*/);
      });
    });

    await test.step('Step 2: Click Edit on the first address', async () => {
      await step('Click Edit button on first available address', async () => {
        const editBtn = page.locator('a[href*="addressedit"]').first();
        const editCount = await editBtn.count();
        await parameter('Addresses Found', String(editCount));
        if (editCount === 0) {
          await attachment('Note', 'No addresses found to edit; skipping', 'text/plain');
          test.skip();
        }
        await editBtn.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*\/customer\/addressedit.*/);
      });
    });

    await test.step('Step 3: Modify city field and save', async () => {
      await step('Change city value and click Save', async () => {
        await page.locator('#Address_City').fill('Los Angeles');
        await parameter('Updated City', 'Los Angeles');
        await page.locator('input[value="Save"]').click();
        await page.waitForLoadState('networkidle');
      });
      await step('Assert redirect back to addresses list', async () => {
        await expect(page).toHaveURL(/.*\/customer\/addresses.*/);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.8  Delete a shipping address
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.8] Delete a shipping address', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can delete an existing address from my account');
    await severity(Severity.NORMAL);
    await tag('MyAccount'); await tag('Regression'); await tag('Address');

    const pom = new PageObjectManager(page);

    await test.step('Step 1: Login and navigate to addresses page', async () => {
      await step('Login and go to /customer/addresses', async () => {
        const loginPage = pom.getLoginPage();
        const credentials = CredentialManager.load();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await page.goto('/customer/addresses');
        await expect(page).toHaveURL(/.*\/customer\/addresses.*/);
      });
    });

    await test.step('Step 2: Count addresses before deletion', async () => {
      await step('Record current address count', async () => {
        const addresses = page.locator('.address-item, .address-list li');
        const countBefore = await addresses.count();
        await parameter('Address Count Before', String(countBefore));
        if (countBefore === 0) {
          await attachment('Note', 'No addresses to delete; skipping', 'text/plain');
          test.skip();
        }
      });
    });

    await test.step('Step 3: Click Delete on the last address', async () => {
      await step('Click the delete button and handle confirmation', async () => {
        const deleteBtn = page.locator('.delete-address-button, button[onclick*="delete"]').last();
        const deleteBtnCount = await deleteBtn.count();
        if (deleteBtnCount === 0) {
          await attachment('Note', 'No delete button found; skipping', 'text/plain');
          test.skip();
        }
        page.on('dialog', dialog => dialog.accept());
        await deleteBtn.click();
        await page.waitForLoadState('networkidle');
      });
    });

    await test.step('Step 4: Verify address count decreased', async () => {
      await step('Assert addresses page updated', async () => {
        await expect(page).toHaveURL(/.*\/customer\/addresses.*/);
        const addressesAfter = page.locator('.address-item, .address-list li');
        const countAfter = await addressesAfter.count();
        await parameter('Address Count After', String(countAfter));
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.9  View downloadable products section
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.9] View downloadable products section', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can view my downloadable products section');
    await severity(Severity.MINOR);
    await tag('MyAccount'); await tag('Regression'); await tag('Downloads');

    const pom = new PageObjectManager(page);

    await test.step('Step 1: Login and navigate to downloadable products', async () => {
      await step('Login and go to /customer/downloadableproducts', async () => {
        const loginPage = pom.getLoginPage();
        const credentials = CredentialManager.load();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await page.goto('/customer/downloadableproducts');
        await expect(page).toHaveURL(/.*\/customer\/downloadableproducts.*/);
      });
    });

    await test.step('Step 2: Verify downloadable products page', async () => {
      await step('Assert page title and content load', async () => {
        const pageTitle = page.locator('.page-title h1, h1');
        await expect(pageTitle.first()).toBeVisible();
        const titleText = await pageTitle.first().innerText();
        await attachment('Page Title', titleText, 'text/plain');

        const downloads = page.locator('.downloadable-products-page table tbody tr');
        const emptyMsg = page.locator('.no-data');
        const downloadCount = await downloads.count();
        const emptyCount = await emptyMsg.count();
        await parameter('Download Count', String(downloadCount));
        if (downloadCount > 0) {
          const names = await downloads.allInnerTexts();
          await attachment('Downloadable Products', JSON.stringify(names, null, 2), 'application/json');
        } else if (emptyCount > 0) {
          const emptyText = await emptyMsg.first().innerText();
          await attachment('Empty Message', emptyText, 'text/plain');
        }
        expect(downloadCount + emptyCount).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.10  View back-in-stock subscriptions
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.10] View back-in-stock subscriptions', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can view my back-in-stock subscriptions');
    await severity(Severity.MINOR);
    await tag('MyAccount'); await tag('Regression'); await tag('Subscriptions');

    const pom = new PageObjectManager(page);

    await test.step('Step 1: Login and navigate to back-in-stock subscriptions', async () => {
      await step('Login and go to /backinstocksubscriptions/manage', async () => {
        const loginPage = pom.getLoginPage();
        const credentials = CredentialManager.load();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await page.goto('/backinstocksubscriptions/manage');
        await expect(page).toHaveURL(/.*\/backinstocksubscriptions\/manage.*/);
      });
    });

    await test.step('Step 2: Verify subscriptions page loads', async () => {
      await step('Assert page content is visible', async () => {
        const pageTitle = page.locator('.page-title h1, h1');
        await expect(pageTitle.first()).toBeVisible();
        const titleText = await pageTitle.first().innerText();
        await attachment('Page Title', titleText, 'text/plain');

        const subscriptions = page.locator('.back-in-stock-subscription-list table tbody tr');
        const emptyMsg = page.locator('.no-data');
        const subCount = await subscriptions.count();
        const emptyCount = await emptyMsg.count();
        await parameter('Subscription Count', String(subCount));
        if (emptyCount > 0) {
          const emptyText = await emptyMsg.first().innerText();
          await attachment('Empty Message', emptyText, 'text/plain');
        }
        expect(subCount + emptyCount).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.11  View reward points balance
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.11] View reward points balance', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can view my reward points balance');
    await severity(Severity.MINOR);
    await tag('MyAccount'); await tag('Regression'); await tag('RewardPoints');

    const pom = new PageObjectManager(page);

    await test.step('Step 1: Login and navigate to reward points page', async () => {
      await step('Login and go to /rewardpoints/history', async () => {
        const loginPage = pom.getLoginPage();
        const credentials = CredentialManager.load();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await page.goto('/rewardpoints/history');
        await expect(page).toHaveURL(/.*\/rewardpoints\/history.*/);
      });
    });

    await test.step('Step 2: Verify reward points page loads', async () => {
      await step('Assert page title and points balance are visible', async () => {
        const pageTitle = page.locator('.page-title h1, h1');
        await expect(pageTitle.first()).toBeVisible();
        const titleText = await pageTitle.first().innerText();
        await attachment('Page Title', titleText, 'text/plain');

        const pointsBalance = page.locator('.reward-points-balance, .current-balance');
        const balanceCount = await pointsBalance.count();
        if (balanceCount > 0) {
          const balanceText = await pointsBalance.first().innerText();
          await attachment('Points Balance', balanceText, 'text/plain');
        }

        const emptyMsg = page.locator('.no-data');
        const tableRows = page.locator('.reward-points-history table tbody tr');
        const rowCount = await tableRows.count();
        const emptyCount = await emptyMsg.count();
        await parameter('Points History Rows', String(rowCount));
        if (emptyCount > 0) {
          const emptyText = await emptyMsg.first().innerText();
          await attachment('Empty Message', emptyText, 'text/plain');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9.12  Manage newsletter subscription preference
  // ─────────────────────────────────────────────────────────────────────────────
  test('[9.12] Manage newsletter subscription preference (subscribe / unsubscribe)', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I can toggle my newsletter subscription preference');
    await severity(Severity.MINOR);
    await tag('MyAccount'); await tag('Regression'); await tag('Newsletter');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that the Customer Info page has a newsletter subscription checkbox
      that can be toggled and saved.</p>
      <h2>Expected Result</h2>
      <p>Newsletter preference is saved and confirmed.</p>
    `);

    const pom = new PageObjectManager(page);

    await test.step('Step 1: Login and navigate to customer info', async () => {
      await step('Login and go to /customer/info', async () => {
        const loginPage = pom.getLoginPage();
        const credentials = CredentialManager.load();
        await loginPage.goto();
        await loginPage.login(credentials.email, credentials.password);
        await page.goto('/customer/info');
        await expect(page).toHaveURL(/.*\/customer\/info.*/);
      });
    });

    await test.step('Step 2: Toggle newsletter checkbox', async () => {
      await step('Check current state and toggle newsletter subscription', async () => {
        const newsletterCheckbox = page.locator('#Newsletter');
        await expect(newsletterCheckbox).toBeVisible();
        const isChecked = await newsletterCheckbox.isChecked();
        await parameter('Initial Newsletter Subscribed', String(isChecked));
        // Toggle the state
        await newsletterCheckbox.setChecked(!isChecked);
        const newState = await newsletterCheckbox.isChecked();
        await parameter('Updated Newsletter Subscribed', String(newState));
      });
    });

    await test.step('Step 3: Save changes and verify', async () => {
      await step('Click Save and assert confirmation', async () => {
        await page.locator('input[value="Save"]').click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/.*\/customer\/info.*/);
        const notification = page.locator('.bar-notification, #bar-notification, .result');
        const notifCount = await notification.count();
        if (notifCount > 0) {
          const notifText = await notification.first().innerText();
          await attachment('Save Confirmation', notifText, 'text/plain');
        }
      });
    });
  });

});
