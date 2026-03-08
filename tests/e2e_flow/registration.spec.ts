import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../../pageobjects/PageObjectManager';
import { CredentialManager } from '../../utils/CredentialManager';
import testData from '../../utils/testdata.json';

test('Register a new user and save credentials', async ({ page }) => {

  // ─── Allure Report Metadata ───────────────────────────────────────────────
  await epic('User Account Management');
  await feature('Registration');
  await story('As a new user, I want to register an account on the web shop');
  await severity(Severity.CRITICAL);
  await owner('QA Team');
  await tag('Registration');
  await tag('Regression');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');

  await descriptionHtml(`
    <h2>Test Objective</h2>
    <p>
      Verify that a <strong>new user</strong> can successfully register on the Tricentis Demo Web Shop
      and that their credentials are saved to <code>utils/credentials.json</code> for reuse in other tests.
    </p>

    <h2>Pre-conditions</h2>
    <ul>
      <li>Application is accessible at <a href="https://demowebshop.tricentis.com">https://demowebshop.tricentis.com</a></li>
      <li>The user does not already exist (unique email generated per run using timestamp)</li>
      <li>Test data is loaded from <code>utils/testdata.json</code></li>
    </ul>

    <h2>Test Steps</h2>
    <ol>
      <li>Navigate to the <strong>Registration</strong> page (<code>/register</code>)</li>
      <li>Select gender and fill in personal details (first name, last name, email)</li>
      <li>Enter and confirm password</li>
      <li>Submit the registration form</li>
      <li>Assert the success message: <em>"Your registration completed"</em></li>
      <li>Append new credentials to <code>utils/credentials.json</code> (old entries preserved)</li>
    </ol>

    <h2>Expected Result</h2>
    <p>
      Registration completes successfully and the new credentials are <strong>appended</strong>
      to <code>credentials.json</code> without removing previously saved entries.
    </p>
  `);

  // ─── Setup ────────────────────────────────────────────────────────────────
  const pom = new PageObjectManager(page);
  const registerPage = pom.getRegisterPage();

  const uniqueEmail = `${testData.newUser.emailPrefix}+${Date.now()}@test.com`;
  const password = testData.newUser.password;

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

  // ─── Step 1: Navigate to Registration Page ────────────────────────────────
  await test.step('Step 1: Navigate to the Registration page', async () => {

    await step('Go to /register', async () => {
      await registerPage.goto();
      await expect(page).toHaveURL(/.*register/);
    });

  });

  // ─── Step 2: Fill and Submit Registration Form ────────────────────────────
  await test.step('Step 2: Fill in registration form and submit', async () => {

    await step(
      `Fill personal details — ${testData.newUser.firstName} ${testData.newUser.lastName} (${testData.newUser.gender})`,
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

  });

  // ─── Step 3: Verify Registration Success ─────────────────────────────────
  await test.step('Step 3: Verify registration success message', async () => {

    await step('Assert success message is displayed', async () => {
      const result = await registerPage.getRegistrationResult();
      expect(result).toContain('Your registration completed');
      await attachment('Registration Result Message', result, 'text/plain');
    });

  });

  // ─── Step 4: Save Credentials ─────────────────────────────────────────────
  await test.step('Step 4: Append new credentials to credentials.json', async () => {

    await step('Save email and password — old credentials are preserved', async () => {
      CredentialManager.save({ email: uniqueEmail, password });

      const all = CredentialManager.loadAll();
      await attachment(
        'All Saved Credentials (credentials.json)',
        JSON.stringify(all.map(c => ({ email: c.email, password: '***hidden***' })), null, 2),
        'application/json'
      );

      await parameter('Total Credentials Stored', String(all.length));
    });

  });

});
