import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/*
  SCRIPT 02 - Allure Steps
  =========================
  This script shows how to:
  1. Break your test into clear steps using allure.step()
  2. Each step will show separately in the Allure report
  3. This makes it very easy to see WHERE a test failed

  Why use steps?
  - Without steps: Report just shows "Test Failed"
  - With steps:    Report shows exactly which step failed
                   e.g. "Step 3: Click Login Button - FAILED"
*/

test('Login with valid credentials', async ({ page }) => {

  await allure.description('This test verifies that a user can login with valid credentials');
  await allure.severity('critical');

  // STEP 1 - Open the website
  await allure.step('Step 1: Open the login page', async () => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
  });

  // STEP 2 - Enter username
  await allure.step('Step 2: Enter username', async () => {
    await page.fill('#username', 'student');
  });

  // STEP 3 - Enter password
  await allure.step('Step 3: Enter password', async () => {
    await page.fill('#password', 'Password123');
  });

  // STEP 4 - Click login button
  await allure.step('Step 4: Click the Login button', async () => {
    await page.click('#submit');
  });

  // STEP 5 - Verify login was successful
  await allure.step('Step 5: Verify successful login message', async () => {
    await expect(page.locator('h1')).toHaveText('Logged In Successfully');
  });

});


test('Login with invalid credentials', async ({ page }) => {

  await allure.description('This test verifies that login fails with wrong credentials');
  await allure.severity('normal');

  await allure.step('Step 1: Open the login page', async () => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
  });

  await allure.step('Step 2: Enter wrong username', async () => {
    await page.fill('#username', 'wronguser');
  });

  await allure.step('Step 3: Enter wrong password', async () => {
    await page.fill('#password', 'wrongpassword');
  });

  await allure.step('Step 4: Click the Login button', async () => {
    await page.click('#submit');
  });

  await allure.step('Step 5: Verify error message is shown', async () => {
    const errorMessage = page.locator('#error');
    await expect(errorMessage).toBeVisible();
  });

});
