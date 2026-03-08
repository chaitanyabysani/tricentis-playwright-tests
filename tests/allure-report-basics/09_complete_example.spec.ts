import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
/*
  SCRIPT 09 - Complete Example (All Features Combined)
  ======================================================
  This script is a COMPLETE EXAMPLE that combines ALL Allure features:

  1. Description    - What the test does
  2. Severity       - How critical the test is
  3. Epic/Feature/Story - How the test is organized
  4. Owner          - Who wrote the test
  5. Tags           - Labels for filtering
  6. Parameters     - What data was used
  7. Steps          - Clear breakdown of test actions
  8. Screenshot     - Visual proof
  9. Links          - Related issues or test cases
  10. Attachments   - Extra information

  Use this script as a REFERENCE TEMPLATE for writing your own tests!
*/

test.describe('Complete Allure Example', () => {

  test.beforeEach(async ({ page }) => {
    // Common setup - runs before each test
    await allure.owner('QA Team');

    const envInfo = `Environment: QA | Date: ${new Date().toDateString()}`;
    await allure.attachment('Environment', envInfo, 'text/plain');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Take screenshot after every test (pass or fail)
    const screenshot = await page.screenshot();
    await allure.attachment('Final Screenshot', screenshot, 'image/png');
  });


  test('Full login flow - complete example', async ({ page }) => {

    // ---- 1. DESCRIPTION ----
    await allure.description(
      'This is a complete end-to-end test of the login flow. ' +
      'It verifies that a valid user can log in and see the success message.'
    );

    // ---- 2. SEVERITY ----
    await allure.severity('critical');

    // ---- 3. ORGANIZATION ----
    await allure.epic('User Management');
    await allure.feature('Login');
    await allure.story('Valid Login Flow');

    // ---- 4. TAGS ----
    await allure.tag('Smoke');
    await allure.tag('Regression');
    await allure.tag('Login');

    // ---- 5. LINKS ----
    await allure.tms('TC-001', 'https://testrail.yourcompany.com/TC-001');
    await allure.issue('BUG-999', 'https://jira.yourcompany.com/BUG-999');

    // ---- 6. PARAMETERS ----
    const username = 'student';
    const password = 'Password123';
    const expectedTitle = 'Logged In Successfully';

    await allure.parameter('Username', username);
    await allure.parameter('Password', password);
    await allure.parameter('Expected Title', expectedTitle);

    // ---- 7. STEPS with SCREENSHOTS ----

    await allure.step('Step 1: Open login page', async () => {
      await page.goto('https://practicetestautomation.com/practice-test-login/');

      // Screenshot after opening page
      const screenshot = await page.screenshot();
      await allure.attachment('Login Page', screenshot, 'image/png');
    });

    await allure.step('Step 2: Enter username', async () => {
      await page.fill('#username', username);
    });

    await allure.step('Step 3: Enter password', async () => {
      await page.fill('#password', password);
    });

    await allure.step('Step 4: Click login button', async () => {
      await page.click('#submit');

      // Screenshot after clicking login
      const screenshot = await page.screenshot();
      await allure.attachment('After Login Click', screenshot, 'image/png');
    });

    await allure.step('Step 5: Verify login was successful', async () => {
      await expect(page.locator('h1')).toHaveText(expectedTitle);

      // Screenshot of success page
      const screenshot = await page.screenshot();
      await allure.attachment('Success Page', screenshot, 'image/png');
    });

    // ---- 8. EXTRA ATTACHMENT - Test summary ----
    const summary = JSON.stringify({
      testName: 'Full login flow',
      username: username,
      status: 'passed',
      timestamp: new Date().toISOString()
    }, null, 2);

    await allure.attachment('Test Summary', summary, 'application/json');

  });

});
