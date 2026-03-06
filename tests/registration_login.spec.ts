import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import { CredentialManager } from '../utils/CredentialManager';
import testData from '../utils/testdata.json';

test('E2E: Register a new user and login with saved credentials', async ({ page }) => {

  // ─── Allure Report Metadata ───────────────────────────────────────────────
  await epic('User Account Management');
  await feature('Registration & Login');
  await story('As a new user, I want to register and login to my account');
  await severity(Severity.CRITICAL);
  await owner('QA Team');
  await tag('E2E');
  await tag('Regression');
  await tag('Authentication');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');

  await descriptionHtml(`
    <h2>Test Objective</h2>
    <p>
      Verify that a <strong>new user</strong> can successfully complete the full registration flow
      on the Tricentis Demo Web Shop and immediately log in using their registered credentials.
    </p>

    <h2>Pre-conditions</h2>
    <ul>
      <li>Application is accessible at <a href="https://demowebshop.tricentis.com">https://demowebshop.tricentis.com</a></li>
      <li>The user does not already exist in the system (unique email is generated per run)</li>
      <li>Test data is loaded from <code>utils/testdata.json</code></li>
    </ul>

    <h2>Test Steps</h2>
    <ol>
      <li>Navigate to the <strong>Registration</strong> page (<code>/register</code>)</li>
      <li>Select gender and fill in personal details (first name, last name, email)</li>
      <li>Enter password and confirm password</li>
      <li>Submit the registration form</li>
      <li>Assert the success message: <em>"Your registration completed"</em></li>
      <li>Save the registered credentials to <code>utils/credentials.json</code></li>
      <li>Navigate to the <strong>Login</strong> page (<code>/login</code>)</li>
      <li>Load saved credentials from <code>utils/credentials.json</code></li>
      <li>Enter email and password and submit the login form</li>
      <li>Assert that the account link and logout button are visible</li>
    </ol>

    <h2>Expected Result</h2>
    <p>
      The user is successfully <strong>registered</strong> and can <strong>log in</strong> immediately.
      After login, the account link and logout icon should be visible in the header,
      confirming the user is authenticated.
    </p>

    <h2>Test Data Source</h2>
    <p>Input data is read from <code>utils/testdata.json</code>.
    A <strong>unique email</strong> is generated at runtime by appending a timestamp to avoid duplicate registration errors.</p>
  `);

  // ─── Setup ────────────────────────────────────────────────────────────────
  const pom = new PageObjectManager(page);
  const registerPage = pom.getRegisterPage();
  const loginPage = pom.getLoginPage();

  const uniqueEmail = `${testData.newUser.emailPrefix}+${Date.now()}@test.com`;
  const password = testData.newUser.password;

  // Attach full test input data to report
  await attachment(
    'Test Input Data (testdata.json)',
    JSON.stringify({
      gender: testData.newUser.gender,
      firstName: testData.newUser.firstName,
      lastName: testData.newUser.lastName,
      generatedEmail: uniqueEmail,
      password: '***hidden***'
    }, null, 2),
    'application/json'
  );

  // ─── Step 1: Register New User ────────────────────────────────────────────
  await test.step('Step 1: Register a new user on the Registration page', async () => {

    await step('Navigate to the Registration page (/register)', async () => {
      await registerPage.goto();
      await expect(page).toHaveURL(/.*register/);
    });

    await step(
      `Fill in personal details — ${testData.newUser.firstName} ${testData.newUser.lastName} (${testData.newUser.gender})`,
      async () => {
        await parameter('Gender', testData.newUser.gender);
        await parameter('First Name', testData.newUser.firstName);
        await parameter('Last Name', testData.newUser.lastName);
        await parameter('Email', uniqueEmail);
        await parameter('Password', '***hidden***');
      }
    );

    await step('Submit the registration form', async () => {
      await registerPage.register(
        testData.newUser.gender as 'male' | 'female',
        testData.newUser.firstName,
        testData.newUser.lastName,
        uniqueEmail,
        password
      );
    });

    await step('Verify registration success message is displayed', async () => {
      const result = await registerPage.getRegistrationResult();
      expect(result).toContain('Your registration completed');
      await attachment('Registration Result Message', result, 'text/plain');
    });

    await step('Save registered credentials to credentials.json for reuse', async () => {
      CredentialManager.save({ email: uniqueEmail, password });
      await attachment(
        'Saved Credentials (credentials.json)',
        JSON.stringify({ email: uniqueEmail, password: '***hidden***' }, null, 2),
        'application/json'
      );
    });

  });

  // ─── Step 2: Navigate to Login Page ──────────────────────────────────────
  await test.step('Step 2: Navigate to the Login page', async () => {

    await step('Go to the Login page (/login)', async () => {
      await loginPage.goto();
    });

    await step('Verify the current URL is the Login page', async () => {
      await expect(page).toHaveURL(/.*login/);
    });

  });

  // ─── Step 3: Login with Saved Credentials ────────────────────────────────
  await test.step('Step 3: Login using saved credentials from credentials.json', async () => {

    await step('Load saved credentials from credentials.json', async () => {
      const credentials = CredentialManager.load();
      await parameter('Login Email', credentials.email);
      await parameter('Login Password', '***hidden***');
    });

    await step('Enter email and password and submit the login form', async () => {
      const credentials = CredentialManager.load();
      await loginPage.login(credentials.email, credentials.password);
    });

    await step('Verify user is logged in — account link is visible in header', async () => {
      await expect(page.locator('.account')).toBeVisible();
    });

    await step('Verify user is logged in — logout button is visible in header', async () => {
      await expect(page.locator('.ico-logout')).toBeVisible();
    });

  });

});
