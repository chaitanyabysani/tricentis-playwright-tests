import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
/*
  SCRIPT 08 - Allure Links (Issue, TMS, Custom Links)
  =====================================================
  This script shows how to link your tests to:

  1. Issue Link  - Link to a bug in Jira, GitHub Issues, etc.
                   When this test fails, it might be related to this bug

  2. TMS Link    - TMS stands for "Test Management System"
                   Link to test cases in tools like TestRail, Zephyr, etc.

  3. Custom Link - Any other URL you want to attach to the test

  Why are links useful?
  - When a test fails, you can immediately click and open the related Jira ticket
  - You can link back to the original test case in TestRail
  - Makes traceability between code and requirements very easy
*/

test('Login page loads correctly - with issue link', async ({ page }) => {

  await allure.description('Verify login page loads with all required elements');
  await allure.severity('critical');
  await allure.epic('User Management');
  await allure.feature('Login');

  // Link to a Jira bug (if this test was written because of a bug)
  await allure.issue('LOGIN-123', 'https://jira.yourcompany.com/browse/LOGIN-123');

  // Link to the test case in TestRail or any test management system
  await allure.tms('TC-456', 'https://testrail.yourcompany.com/index.php?/cases/view/456');

  // Add a custom link (e.g., requirement document, design spec)
  await allure.link('https://docs.yourcompany.com/login-requirements', 'Login Requirements Document');

  await allure.step('Open login page', async () => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
  });

  await allure.step('Verify username field is visible', async () => {
    await expect(page.locator('#username')).toBeVisible();
  });

  await allure.step('Verify password field is visible', async () => {
    await expect(page.locator('#password')).toBeVisible();
  });

  await allure.step('Verify login button is visible', async () => {
    await expect(page.locator('#submit')).toBeVisible();
  });

});


test('Successful login - with TMS link', async ({ page }) => {

  await allure.description('Verify user can login successfully');
  await allure.severity('blocker');
  await allure.epic('User Management');
  await allure.feature('Login');
  await allure.story('Valid Login');

  // Link to the test case document
  await allure.tms('TC-101', 'https://testrail.yourcompany.com/index.php?/cases/view/101');

  // Link to the user story in Jira
  await allure.issue('USER-STORY-55', 'https://jira.yourcompany.com/browse/USER-STORY-55');

  await allure.step('Open login page', async () => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
  });

  await allure.step('Login with valid credentials', async () => {
    await page.fill('#username', 'student');
    await page.fill('#password', 'Password123');
    await page.click('#submit');
  });

  await allure.step('Verify login success', async () => {
    await expect(page.locator('h1')).toHaveText('Logged In Successfully');
  });

});
