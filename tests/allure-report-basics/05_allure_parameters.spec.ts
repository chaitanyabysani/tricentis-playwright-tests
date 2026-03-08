import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/*
  SCRIPT 05 - Allure Parameters
  ===============================
  This script shows how to:
  1. Add parameters to your Allure report
  2. Parameters show WHAT DATA was used during the test
  3. Very useful when running same test with different data (data-driven testing)

  Example:
  Without parameters: Report just shows "Login Test - FAILED"
  With parameters:    Report shows "Login Test - FAILED | Username: admin | Password: wrong123"

  This helps you immediately know WHICH data caused the failure!
*/

// ---- Example 1: Simple parameter usage ----

test('Verify practice test site homepage loads correctly', async ({ page }) => {

  await allure.description('This test verifies the practice test site homepage loads correctly with parameters');
  await allure.severity('normal');

  // Define what data we are using in this test
  const siteUrl = 'https://practicetestautomation.com';
  const expectedTitlePattern = /Practice Test Automation/;

  // Add parameters to Allure report - these show what DATA was used in the test
  await allure.parameter('Site URL', siteUrl);
  await allure.parameter('Expected Title Pattern', 'Contains "Practice Test Automation"');

  await allure.step('Step 1: Navigate to practice test site', async () => {
    await page.goto(siteUrl);
  });

  await allure.step('Step 2: Verify page title matches expected pattern', async () => {
    await expect(page).toHaveTitle(expectedTitlePattern);
  });

  await allure.step('Step 3: Verify practice test site has content', async () => {
    // Verify page has main heading which proves page loaded correctly
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
  });

});


// ---- Example 2: Data driven test with parameters ----
// Run the same LOGIN test with different username and password combinations
// This demonstrates how parameters help identify which DATA caused test failure

const loginTestData = [
  { username: 'student',    password: 'Password123', expectedResult: 'success' },
  { username: 'wronguser',  password: 'Password123', expectedResult: 'failure' },
  { username: 'student',    password: 'wrongpass',   expectedResult: 'failure' },
];

for (const data of loginTestData) {

  test(`Data-driven Login - Username: ${data.username} - Expected: ${data.expectedResult}`, async ({ page }) => {

    await allure.description('Data-driven login test demonstrating parameter usage with different credentials');
    await allure.severity('critical');
    await allure.epic('User Management');
    await allure.feature('Login Functionality');
    await allure.story('User Authentication');

    // ADD PARAMETERS - these will appear in Allure report to show WHAT DATA was used
    await allure.parameter('Username', data.username);
    await allure.parameter('Password', data.password);
    await allure.parameter('Expected Result', data.expectedResult);

    await allure.step('Step 1: Navigate to login page', async () => {
      await page.goto('https://practicetestautomation.com/practice-test-login/');
    });

    await allure.step('Step 2: Enter username and password, then submit', async () => {
      await page.fill('#username', data.username);
      await page.fill('#password', data.password);
      await page.click('#submit');
    });

    if (data.expectedResult === 'success') {
      await allure.step('Step 3: Verify successful login message appears', async () => {
        await expect(page.locator('h1')).toHaveText('Logged In Successfully');
      });
    } else {
      await allure.step('Step 3: Verify error message appears for invalid login', async () => {
        await expect(page.locator('#error')).toBeVisible();
      });
    }

  });

}
