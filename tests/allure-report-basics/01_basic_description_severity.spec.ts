import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/*
  SCRIPT 01 - Basic Description and Severity
  ============================================
  This script shows how to:
  1. Add a description to your test
  2. Set the severity level of your test
  3. Add owner information

  Severity Levels:
  - blocker  : Must fix immediately
  - critical : Very important feature
  - normal   : Regular test
  - minor    : Small issue
  - trivial  : Very low priority
*/

test('Verify Google homepage title', async ({ page }) => {

  // Step 1: Add a description - explains what this test does
  await allure.description('This test verifies that the Google homepage loads correctly and the title is correct');

  // Step 2: Set the severity level
  await allure.severity('critical');

  // Step 3: Add owner - who wrote this test
  await allure.owner('John');

  // Step 4: Add a tag
  await allure.tag('Smoke Test');
  await allure.tag('Homepage');

  // Actual test steps
  await page.goto('https://www.google.com');
  await expect(page).toHaveTitle(/Google/);

});


test('Verify Google search box is visible', async ({ page }) => {

  await allure.description('This test verifies that the search box is visible on Google homepage');
  await allure.severity('normal');
  await allure.owner('Jane');
  await allure.tag('Smoke Test');

  await page.goto('https://www.google.com');

  const searchBox = page.locator('textarea[name="q"]');
  await expect(searchBox).toBeVisible();

});
