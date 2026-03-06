import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import { CredentialManager } from '../utils/CredentialManager';
import testData from '../utils/testdata.json';

// ─── Shared helpers ────────────────────────────────────────────────────────────
const BASE_META = async () => {
  await epic('User Account Management');
  await feature('Registration');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 1 — User Registration', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 1.1  Register with valid data — male gender
  // ─────────────────────────────────────────────────────────────────────────────
  test('[1.1] Register with valid data — male gender', async ({ page }) => {
    await BASE_META();
    await story('As a new user, I want to register with male gender and valid credentials');
    await severity(Severity.CRITICAL);
    await tag('Registration'); await tag('Regression'); await tag('Happy-Path');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify successful registration using male gender and valid personal details.</p>
      <h2>Expected Result</h2>
      <p>Success message "Your registration completed" is displayed and credentials are saved.</p>
    `);

    const pom = new PageObjectManager(page);
    const registerPage = pom.getRegisterPage();
    const uniqueEmail = `${testData.newUser.emailPrefix}+${Date.now()}@test.com`;

    await attachment('Test Input', JSON.stringify({ gender: 'male', email: uniqueEmail }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /register', async () => {
      await step('Go to register page', async () => {
        await registerPage.goto();
        await expect(page).toHaveURL(/.*register/);
      });
    });

    await test.step('Step 2: Fill and submit registration form', async () => {
      await step('Fill form with male gender', async () => {
        await parameter('Gender', 'male');
        await parameter('Email', uniqueEmail);
        await registerPage.register('male', testData.newUser.firstName, testData.newUser.lastName, uniqueEmail, testData.newUser.password);
      });
    });

    await test.step('Step 3: Verify success and save credentials', async () => {
      await step('Assert success message', async () => {
        const result = await registerPage.getRegistrationResult();
        expect(result).toContain('Your registration completed');
        await attachment('Registration Result', result, 'text/plain');
        CredentialManager.save({ email: uniqueEmail, password: testData.newUser.password });
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1.2  Register with valid data — female gender
  // ─────────────────────────────────────────────────────────────────────────────
  test('[1.2] Register with valid data — female gender', async ({ page }) => {
    await BASE_META();
    await story('As a new user, I want to register with female gender and valid credentials');
    await severity(Severity.CRITICAL);
    await tag('Registration'); await tag('Regression'); await tag('Happy-Path');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify successful registration using female gender and valid personal details.</p>
      <h2>Expected Result</h2>
      <p>Success message "Your registration completed" is displayed.</p>
    `);

    const pom = new PageObjectManager(page);
    const registerPage = pom.getRegisterPage();
    const uniqueEmail = `janedoe+${Date.now()}@test.com`;

    await attachment('Test Input', JSON.stringify({ gender: 'female', email: uniqueEmail }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /register', async () => {
      await step('Go to register page', async () => {
        await registerPage.goto();
        await expect(page).toHaveURL(/.*register/);
      });
    });

    await test.step('Step 2: Fill and submit form with female gender', async () => {
      await step('Fill form with female gender', async () => {
        await parameter('Gender', 'female');
        await parameter('Email', uniqueEmail);
        await registerPage.register('female', 'Jane', 'Doe', uniqueEmail, testData.newUser.password);
      });
    });

    await test.step('Step 3: Verify success message', async () => {
      await step('Assert success message', async () => {
        const result = await registerPage.getRegistrationResult();
        expect(result).toContain('Your registration completed');
        await attachment('Registration Result', result, 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1.3  Register with duplicate email → error message
  // ─────────────────────────────────────────────────────────────────────────────
  test('[1.3] Register with duplicate email → error message', async ({ page }) => {
    await BASE_META();
    await story('As a user attempting to register with an already-used email, I see an error');
    await severity(Severity.CRITICAL);
    await tag('Registration'); await tag('Regression'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that registering with an already-registered email shows a duplicate error message.</p>
      <h2>Pre-conditions</h2>
      <ul>
        <li>A user with the same email is registered in Step 1 of this test</li>
      </ul>
      <h2>Expected Result</h2>
      <p>An error message indicating the email already exists is displayed.</p>
    `);

    const pom = new PageObjectManager(page);
    const registerPage = pom.getRegisterPage();
    const duplicateEmail = `duplicate+${Date.now()}@test.com`;

    await attachment('Test Input', JSON.stringify({ email: duplicateEmail }, null, 2), 'application/json');

    await test.step('Step 1: Register email for the first time (setup)', async () => {
      await step('First registration — should succeed', async () => {
        await registerPage.goto();
        await registerPage.register('male', 'John', 'Doe', duplicateEmail, testData.newUser.password);
        const result = await registerPage.getRegistrationResult();
        expect(result).toContain('Your registration completed');
      });
    });

    await test.step('Step 2: Attempt to register again with the same email', async () => {
      await step('Second registration with duplicate email', async () => {
        await parameter('Duplicate Email', duplicateEmail);
        await registerPage.goto();
        await registerPage.register('male', 'John', 'Doe', duplicateEmail, testData.newUser.password);
      });
    });

    await test.step('Step 3: Verify duplicate email error is shown', async () => {
      await step('Assert error message for duplicate email', async () => {
        const errorBlock = page.locator('.validation-summary-errors');
        await expect(errorBlock).toBeVisible();
        const errorText = await errorBlock.innerText();
        await attachment('Duplicate Email Error', errorText, 'text/plain');
        expect(errorText.toLowerCase()).toContain('already');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1.4  Register with blank required fields → validation errors
  // ─────────────────────────────────────────────────────────────────────────────
  test('[1.4] Register with blank required fields → validation errors', async ({ page }) => {
    await BASE_META();
    await story('As a user who submits an empty registration form, I see field-level validation errors');
    await severity(Severity.CRITICAL);
    await tag('Registration'); await tag('Regression'); await tag('Validation'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that submitting the registration form with all required fields blank shows inline validation errors.</p>
      <h2>Expected Result</h2>
      <p>Validation error messages appear for First Name, Last Name, Email, Password, and Confirm Password fields.</p>
    `);

    const pom = new PageObjectManager(page);
    const registerPage = pom.getRegisterPage();

    await test.step('Step 1: Navigate to /register', async () => {
      await step('Go to register page', async () => {
        await registerPage.goto();
        await expect(page).toHaveURL(/.*register/);
      });
    });

    await test.step('Step 2: Submit form with all fields blank', async () => {
      await step('Click Register without filling any field', async () => {
        await registerPage.registerButton.click();
      });
    });

    await test.step('Step 3: Verify inline validation errors', async () => {
      await step('Assert First Name error is visible', async () => {
        await expect(registerPage.firstNameError).toBeVisible();
        await attachment('First Name Error', await registerPage.firstNameError.innerText(), 'text/plain');
      });
      await step('Assert Last Name error is visible', async () => {
        await expect(registerPage.lastNameError).toBeVisible();
        await attachment('Last Name Error', await registerPage.lastNameError.innerText(), 'text/plain');
      });
      await step('Assert Email error is visible', async () => {
        await expect(registerPage.emailError).toBeVisible();
        await attachment('Email Error', await registerPage.emailError.innerText(), 'text/plain');
      });
      await step('Assert Password error is visible', async () => {
        await expect(registerPage.passwordError).toBeVisible();
        await attachment('Password Error', await registerPage.passwordError.innerText(), 'text/plain');
      });
      await step('Assert Confirm Password error is visible', async () => {
        await expect(registerPage.confirmPasswordError).toBeVisible();
        await attachment('Confirm Password Error', await registerPage.confirmPasswordError.innerText(), 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1.5  Register with invalid email format → validation error
  // ─────────────────────────────────────────────────────────────────────────────
  test('[1.5] Register with invalid email format → validation error', async ({ page }) => {
    await BASE_META();
    await story('As a user entering an invalid email format, I see an email validation error');
    await severity(Severity.CRITICAL);
    await tag('Registration'); await tag('Regression'); await tag('Validation'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that entering an invalid email format (e.g. "notanemail") shows an appropriate validation error on the Email field.</p>
      <h2>Expected Result</h2>
      <p>Email field validation error is displayed indicating the format is incorrect.</p>
    `);

    const pom = new PageObjectManager(page);
    const registerPage = pom.getRegisterPage();
    const invalidEmail = 'notanemail';

    await attachment('Test Input', JSON.stringify({ email: invalidEmail }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /register', async () => {
      await step('Go to register page', async () => {
        await registerPage.goto();
        await expect(page).toHaveURL(/.*register/);
      });
    });

    await test.step('Step 2: Fill form with invalid email and submit', async () => {
      await step('Enter invalid email format', async () => {
        await parameter('Invalid Email', invalidEmail);
        await registerPage.firstNameInput.fill(testData.newUser.firstName);
        await registerPage.lastNameInput.fill(testData.newUser.lastName);
        await registerPage.emailInput.fill(invalidEmail);
        await registerPage.passwordInput.fill(testData.newUser.password);
        await registerPage.confirmPasswordInput.fill(testData.newUser.password);
        await registerPage.registerButton.click();
      });
    });

    await test.step('Step 3: Verify email validation error', async () => {
      await step('Assert email error message is shown', async () => {
        await expect(registerPage.emailError).toBeVisible();
        const errorText = await registerPage.emailError.innerText();
        await attachment('Email Validation Error', errorText, 'text/plain');
        expect(errorText.length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1.6  Register with mismatched passwords → validation error
  // ─────────────────────────────────────────────────────────────────────────────
  test('[1.6] Register with mismatched passwords → validation error', async ({ page }) => {
    await BASE_META();
    await story('As a user entering different password and confirm password values, I see a mismatch error');
    await severity(Severity.CRITICAL);
    await tag('Registration'); await tag('Regression'); await tag('Validation'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that entering different values in Password and Confirm Password fields triggers a validation error.</p>
      <h2>Expected Result</h2>
      <p>Confirm Password field shows a validation error indicating the passwords do not match.</p>
    `);

    const pom = new PageObjectManager(page);
    const registerPage = pom.getRegisterPage();
    const uniqueEmail = `mismatch+${Date.now()}@test.com`;
    const password = testData.newUser.password;
    const differentPassword = 'DifferentPass@9999';

    await attachment('Test Input', JSON.stringify({
      email: uniqueEmail,
      password: '***hidden***',
      confirmPassword: '***different***'
    }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /register', async () => {
      await step('Go to register page', async () => {
        await registerPage.goto();
        await expect(page).toHaveURL(/.*register/);
      });
    });

    await test.step('Step 2: Fill form with mismatched passwords', async () => {
      await step('Enter password and a different confirm password', async () => {
        await parameter('Password', '***hidden***');
        await parameter('Confirm Password', '***different***');
        await registerPage.genderMaleRadio.click();
        await registerPage.firstNameInput.fill(testData.newUser.firstName);
        await registerPage.lastNameInput.fill(testData.newUser.lastName);
        await registerPage.emailInput.fill(uniqueEmail);
        await registerPage.passwordInput.fill(password);
        await registerPage.confirmPasswordInput.fill(differentPassword);
        await registerPage.registerButton.click();
      });
    });

    await test.step('Step 3: Verify password mismatch validation error', async () => {
      await step('Assert confirm password error is shown', async () => {
        await expect(registerPage.confirmPasswordError).toBeVisible();
        const errorText = await registerPage.confirmPasswordError.innerText();
        await attachment('Password Mismatch Error', errorText, 'text/plain');
        expect(errorText.length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1.7  Register with weak/short password → validation error
  // ─────────────────────────────────────────────────────────────────────────────
  test('[1.7] Register with weak/short password → validation error', async ({ page }) => {
    await BASE_META();
    await story('As a user entering a weak password, I see a password strength validation error');
    await severity(Severity.NORMAL);
    await tag('Registration'); await tag('Regression'); await tag('Validation'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that entering a very short/weak password (e.g. "abc") triggers a password validation error.</p>
      <h2>Expected Result</h2>
      <p>Password field shows a validation error about minimum length or strength requirements.</p>
    `);

    const pom = new PageObjectManager(page);
    const registerPage = pom.getRegisterPage();
    const uniqueEmail = `weakpass+${Date.now()}@test.com`;
    const weakPassword = 'abc';

    await attachment('Test Input', JSON.stringify({ email: uniqueEmail, password: weakPassword }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /register', async () => {
      await step('Go to register page', async () => {
        await registerPage.goto();
        await expect(page).toHaveURL(/.*register/);
      });
    });

    await test.step('Step 2: Fill form with short/weak password', async () => {
      await step('Enter weak password (too short)', async () => {
        await parameter('Weak Password', weakPassword);
        await registerPage.genderMaleRadio.click();
        await registerPage.firstNameInput.fill(testData.newUser.firstName);
        await registerPage.lastNameInput.fill(testData.newUser.lastName);
        await registerPage.emailInput.fill(uniqueEmail);
        await registerPage.passwordInput.fill(weakPassword);
        await registerPage.confirmPasswordInput.fill(weakPassword);
        await registerPage.registerButton.click();
      });
    });

    await test.step('Step 3: Verify password validation error', async () => {
      await step('Assert password error message is shown', async () => {
        await expect(registerPage.passwordError).toBeVisible();
        const errorText = await registerPage.passwordError.innerText();
        await attachment('Password Validation Error', errorText, 'text/plain');
        expect(errorText.length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1.8  Verify redirect / Continue button after successful registration
  // ─────────────────────────────────────────────────────────────────────────────
  test('[1.8] Verify Continue button and redirect after successful registration', async ({ page }) => {
    await BASE_META();
    await story('As a newly registered user, I can click Continue and reach the home page');
    await severity(Severity.NORMAL);
    await tag('Registration'); await tag('Regression'); await tag('Happy-Path');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that after successful registration:</p>
      <ul>
        <li>The "Your registration completed" success message is shown</li>
        <li>A "Continue" button is visible</li>
        <li>Clicking "Continue" redirects to the home page</li>
      </ul>
      <h2>Expected Result</h2>
      <p>User lands on the home page after clicking Continue.</p>
    `);

    const pom = new PageObjectManager(page);
    const registerPage = pom.getRegisterPage();
    const uniqueEmail = `redirect+${Date.now()}@test.com`;

    await attachment('Test Input', JSON.stringify({ email: uniqueEmail }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /register', async () => {
      await step('Go to register page', async () => {
        await registerPage.goto();
        await expect(page).toHaveURL(/.*register/);
      });
    });

    await test.step('Step 2: Complete registration successfully', async () => {
      await step('Fill and submit valid registration form', async () => {
        await parameter('Email', uniqueEmail);
        await registerPage.register(
          testData.newUser.gender as 'male' | 'female',
          testData.newUser.firstName,
          testData.newUser.lastName,
          uniqueEmail,
          testData.newUser.password
        );
      });
    });

    await test.step('Step 3: Verify success message and Continue button', async () => {
      await step('Assert success message is displayed', async () => {
        const result = await registerPage.getRegistrationResult();
        expect(result).toContain('Your registration completed');
        await attachment('Registration Result', result, 'text/plain');
      });
      await step('Assert Continue button is visible', async () => {
        await expect(registerPage.continueButton).toBeVisible();
      });
    });

    await test.step('Step 4: Click Continue and verify redirect to home page', async () => {
      await step('Click Continue button', async () => {
        await registerPage.continueButton.click();
      });
      await step('Verify home page is loaded', async () => {
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
        await attachment('Final URL', page.url(), 'text/plain');
      });
    });
  });

});
