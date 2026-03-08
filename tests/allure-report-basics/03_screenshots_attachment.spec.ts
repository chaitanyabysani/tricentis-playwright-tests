import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/*
  SCRIPT 03 - Screenshots in Allure
  ===================================
  This script shows how to:
  1. Take a screenshot manually and attach it to Allure report
  2. Take screenshots at different points (before, during, after)
  3. Screenshots help you visually see what happened during the test

  Types of attachments:
  - image/png  : PNG screenshot
  - image/jpeg : JPEG screenshot
  - text/plain : Plain text
  - text/html  : HTML content
  - application/json : JSON data
*/

test('Attach screenshots at different stages', async ({ page }) => {

  await allure.description('This test shows how to attach screenshots at different stages of the test');
  await allure.severity('normal');

  // STEP 1 - Open the website
  await allure.step('Step 1: Open the website', async () => {
    await page.goto('https://www.google.com');

    // Take screenshot and attach to Allure report
    const screenshot = await page.screenshot();
    await allure.attachment('Homepage Screenshot', screenshot, 'image/png');
  });

  // STEP 2 - Type in search box
  await allure.step('Step 2: Type in the search box', async () => {
    await page.fill('textarea[name="q"]', 'Playwright Automation');

    // Take screenshot after typing
    const screenshot = await page.screenshot();
    await allure.attachment('After Typing Screenshot', screenshot, 'image/png');
  });

  // STEP 3 - Take full page screenshot
  await allure.step('Step 3: Take a full page screenshot', async () => {

    // Full page screenshot captures the entire page including scroll
    const fullPageScreenshot = await page.screenshot({ fullPage: true });
    await allure.attachment('Full Page Screenshot', fullPageScreenshot, 'image/png');
  });

});


test('Attach screenshot when test fails', async ({ page }) => {

  await allure.description('This test shows how to attach a screenshot when something goes wrong');
  await allure.severity('critical');

  await allure.step('Step 1: Open the website', async () => {
    await page.goto('https://www.google.com');
  });

  // Use try-catch to take screenshot if something fails
  try {
    await allure.step('Step 2: Perform action that might fail', async () => {
      await page.click('#someButtonThatDoesNotExist', { timeout: 3000 });
    });
  } catch (error) {

    // Take screenshot when error occurs and attach to report
    await allure.step('Step 2A: Error captured - taking failure screenshot', async () => {
      const screenshot = await page.screenshot();
      await allure.attachment('Failure Screenshot', screenshot, 'image/png');
    });

    // Also attach the error message as text
    await allure.step('Step 2B: Attaching error details', async () => {
      await allure.attachment('Error Message', String(error), 'text/plain');
      await allure.attachment('Error Type', error instanceof Error ? error.name : 'Unknown Error', 'text/plain');
    });

    // Recover from error - continue with alternative action
    await allure.step('Step 3: Recover from error and continue test', async () => {
      // Navigate to a valid page after error
      await page.goto('https://www.google.com/search?q=Playwright');
      
      // Take screenshot showing recovery
      const recoveryScreenshot = await page.screenshot();
      await allure.attachment('Recovery Screenshot', recoveryScreenshot, 'image/png');
      
      // Verify recovery was successful
      await expect(page).toHaveTitle(/.*Playwright.*/i);
    });

    // Document what was recovered
    await allure.step('Step 4: Verify test recovery successful', async () => {
      const pageTitle = await page.title();
      await allure.attachment('Recovery Status', `Successfully recovered. Page title: ${pageTitle}`, 'text/plain');
    });
  }

});
