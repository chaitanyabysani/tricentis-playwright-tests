import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/*
  SCRIPT 07 - Allure with Hooks (beforeEach and afterEach)
  =========================================================
  This script shows how to use Allure inside hooks.

  What are Hooks?
  - beforeEach : Code that runs BEFORE every test
  - afterEach  : Code that runs AFTER every test

  Common uses with Allure:
  - Take screenshot after every failed test (in afterEach)
  - Log test start/end times
  - Attach test environment info before every test
*/

test.describe('Login Feature Tests', () => {

  // ---- beforeEach: runs before every test in this group ----
  test.beforeEach(async ({ page }) => {

    // Set common Allure info for all tests in this group
    await allure.epic('User Management');
    await allure.feature('Login');
    await allure.owner('QA Team');

    // Attach environment info to every test
    const environmentInfo = `
      Environment : QA
      Base URL    : https://practicetestautomation.com
      Browser     : Chromium
      Date        : ${new Date().toDateString()}
    `;
    await allure.attachment('Environment Info', environmentInfo, 'text/plain');

    // Open the login page before every test
    await allure.step('Before Test: Open login page', async () => {
      await page.goto('https://practicetestautomation.com/practice-test-login/');
    });

  });


  // ---- afterEach: runs after every test in this group ----
  test.afterEach(async ({ page }, testInfo) => {

    // If the test FAILED, take a screenshot and attach to Allure
    if (testInfo.status === 'failed') {
      await allure.step('After Test: Capturing failure screenshot', async () => {
        const screenshot = await page.screenshot();
        await allure.attachment('Failure Screenshot', screenshot, 'image/png');
      });
    }

    // Always log test result
    const result = `
      Test Name   : ${testInfo.title}
      Status      : ${testInfo.status}
      Duration    : ${testInfo.duration} ms
    `;
    await allure.attachment('Test Result Summary', result, 'text/plain');

  });


  // ---- Test 1 ----
  test('Valid login', async ({ page }) => {

    await allure.story('Valid Login');
    await allure.description('Verify successful login with correct credentials');
    await allure.severity('critical');

    await allure.step('Enter valid credentials', async () => {
      await page.fill('#username', 'student');
      await page.fill('#password', 'Password123');
      await page.click('#submit');
    });

    await allure.step('Verify login success', async () => {
      await expect(page.locator('h1')).toHaveText('Logged In Successfully');
    });

  });


  // ---- Test 2 ----
  test('Invalid login', async ({ page }) => {

    await allure.story('Invalid Login');
    await allure.description('Verify error message when wrong credentials are entered');
    await allure.severity('normal');

    await allure.step('Enter wrong credentials', async () => {
      await page.fill('#username', 'wronguser');
      await page.fill('#password', 'wrongpassword');
      await page.click('#submit');
    });

    await allure.step('Verify error message', async () => {
      await expect(page.locator('#error')).toBeVisible();
    });

  });


  // ---- Test 3 ----
  test('Empty credentials login', async ({ page }) => {

    await allure.story('Empty Credentials Login');
    await allure.description('Verify error message when no credentials are entered');
    await allure.severity('minor');

    await allure.step('Click login without entering credentials', async () => {
      await page.click('#submit');
    });

    await allure.step('Verify error or validation message', async () => {
      // Just verify we are still on the login page
      await expect(page).toHaveURL(/practice-test-login/);
    });

  });

});
