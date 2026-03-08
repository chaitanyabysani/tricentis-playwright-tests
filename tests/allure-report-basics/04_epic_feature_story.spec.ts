import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/*
  SCRIPT 04 - Allure Labels (Epic, Feature, Story)
  ==================================================
  This script shows how to organize your tests using:

  EPIC    = Big module or project area
            Example: "User Management", "Payment System"

  FEATURE = Specific feature inside the epic
            Example: "Login", "Registration", "Logout"

  STORY   = Specific user story or scenario inside the feature
            Example: "Valid Login", "Invalid Login", "Forgot Password"

  Think of it like a folder structure:
  Epic > Feature > Story

  Why use these?
  - Helps organize 100s of tests in a clear structure
  - Makes reports easy to filter and navigate
  - Non-technical managers can understand the report easily
*/


// ============================================================
// EPIC: User Management
// FEATURE: Login
// ============================================================

test('Valid login with correct credentials', async ({ page }) => {

  // Organize this test under Epic > Feature > Story
  await allure.epic('User Management');
  await allure.feature('Login');
  await allure.story('Valid Login');

  await allure.description('Verify that user can login successfully with correct username and password');
  await allure.severity('critical');

  await allure.step('Open login page', async () => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
  });

  await allure.step('Enter valid credentials and login', async () => {
    await page.fill('#username', 'student');
    await page.fill('#password', 'Password123');
    await page.click('#submit');
  });

  await allure.step('Verify successful login', async () => {
    await expect(page.locator('h1')).toHaveText('Logged In Successfully');
  });

});


test('Invalid login with wrong password', async ({ page }) => {

  await allure.epic('User Management');
  await allure.feature('Login');
  await allure.story('Invalid Login');

  await allure.description('Verify that login fails when wrong password is entered');
  await allure.severity('normal');

  await allure.step('Open login page', async () => {
    await page.goto('https://practicetestautomation.com/practice-test-login/');
  });

  await allure.step('Enter invalid credentials and click login', async () => {
    await page.fill('#username', 'student');
    await page.fill('#password', 'wrongpassword');
    await page.click('#submit');
  });

  await allure.step('Verify error message is displayed', async () => {
    await expect(page.locator('#error')).toBeVisible();
  });

});


// ============================================================
// EPIC: User Management
// FEATURE: Registration
// ============================================================

test('Registration page loads correctly', async ({ page }) => {

  await allure.epic('User Management');
  await allure.feature('Registration');
  await allure.story('Registration Page Load');

  await allure.description('Verify that the registration page loads and all fields are visible');
  await allure.severity('normal');

  await allure.step('Open registration page', async () => {
    await page.goto('https://practicetestautomation.com/');
  });

  await allure.step('Verify page title', async () => {
    await expect(page).toHaveTitle(/Practice Test Automation/);
  });

});


// ============================================================
// EPIC: Shopping Cart
// FEATURE: Checkout
// ============================================================

test('Checkout page is accessible', async ({ page }) => {

  await allure.epic('Shopping Cart');
  await allure.feature('Checkout');
  await allure.story('Checkout Page Navigation');

  await allure.description('Verify that the checkout page is accessible');
  await allure.severity('blocker');

  await allure.step('Open homepage', async () => {
    await page.goto('https://www.google.com');
  });

  await allure.step('Verify page loads', async () => {
    await expect(page).toHaveTitle(/Google/);
  });

});
