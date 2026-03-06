import { test, expect } from '@playwright/test';
import {
  epic, feature, story, severity, owner, tag, link,
  descriptionHtml, parameter, attachment, step
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import { CredentialManager } from '../utils/CredentialManager';
import testData from '../utils/testdata.json';

// ─── Shared helpers ─────────────────────────────────────────────────────────────
const BASE_META = async () => {
  await epic('User Account Management');
  await feature('Authentication');
  await owner('QA Team');
  await link('https://demowebshop.tricentis.com', 'Application Under Test');
};

test.describe('Module 2 — User Authentication (Login / Logout)', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 2.1  Login with valid credentials
  // ─────────────────────────────────────────────────────────────────────────────
  test('[2.1] Login with valid credentials', async ({ page }) => {
    await BASE_META();
    await story('As a registered user, I want to log in with valid credentials');
    await severity(Severity.CRITICAL);
    await tag('Login'); await tag('Regression'); await tag('Happy-Path');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a registered user can log in successfully using valid email and password.</p>
      <h2>Pre-conditions</h2>
      <ul>
        <li>A registered user exists in <code>utils/credentials.json</code></li>
      </ul>
      <h2>Expected Result</h2>
      <p>User is redirected to the home page and their account name is visible in the header.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const homePage = pom.getHomePage();
    const credentials = CredentialManager.load();

    await attachment('Test Input', JSON.stringify({ email: credentials.email, password: '***hidden***' }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /login', async () => {
      await step('Go to login page', async () => {
        await loginPage.goto();
        await expect(page).toHaveURL(/.*login/);
      });
    });

    await test.step('Step 2: Enter valid credentials and submit', async () => {
      await step('Fill email and password then click Login', async () => {
        await parameter('Email', credentials.email);
        await parameter('Password', '***hidden***');
        await loginPage.login(credentials.email, credentials.password);
      });
    });

    await test.step('Step 3: Verify successful login', async () => {
      await step('Assert user is redirected to home page', async () => {
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
      await step('Assert account link is visible in header', async () => {
        await expect(homePage.accountLink).toBeVisible();
        const accountText = await homePage.accountLink.innerText();
        await attachment('Logged-in Account', accountText, 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2.2  Login with invalid password → error message
  // ─────────────────────────────────────────────────────────────────────────────
  test('[2.2] Login with invalid password → error message', async ({ page }) => {
    await BASE_META();
    await story('As a user entering a wrong password, I see a login error message');
    await severity(Severity.CRITICAL);
    await tag('Login'); await tag('Regression'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that logging in with a registered email but wrong password shows an error message.</p>
      <h2>Expected Result</h2>
      <p>A login error message is displayed indicating the credentials are incorrect.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const credentials = CredentialManager.load();
    const wrongPassword = 'WrongPassword@999';

    await attachment('Test Input', JSON.stringify({ email: credentials.email, password: '***wrong***' }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /login', async () => {
      await step('Go to login page', async () => {
        await loginPage.goto();
        await expect(page).toHaveURL(/.*login/);
      });
    });

    await test.step('Step 2: Enter valid email with wrong password', async () => {
      await step('Submit login form with incorrect password', async () => {
        await parameter('Email', credentials.email);
        await parameter('Password', '***wrong***');
        await loginPage.login(credentials.email, wrongPassword);
      });
    });

    await test.step('Step 3: Verify login error is shown', async () => {
      await step('Assert error message is visible', async () => {
        await expect(loginPage.loginError).toBeVisible();
        const errorText = await loginPage.getLoginErrorMessage();
        await attachment('Login Error Message', errorText, 'text/plain');
        expect(errorText.length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2.3  Login with unregistered email → error message
  // ─────────────────────────────────────────────────────────────────────────────
  test('[2.3] Login with unregistered email → error message', async ({ page }) => {
    await BASE_META();
    await story('As a user entering an email that has no account, I see a login error message');
    await severity(Severity.CRITICAL);
    await tag('Login'); await tag('Regression'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that attempting to log in with an email address that does not exist shows an error message.</p>
      <h2>Expected Result</h2>
      <p>A login error message is displayed indicating no account was found.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const nonExistentEmail = `notregistered+${Date.now()}@test.com`;

    await attachment('Test Input', JSON.stringify({ email: nonExistentEmail }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /login', async () => {
      await step('Go to login page', async () => {
        await loginPage.goto();
        await expect(page).toHaveURL(/.*login/);
      });
    });

    await test.step('Step 2: Enter unregistered email and submit', async () => {
      await step('Submit with email that has no account', async () => {
        await parameter('Unregistered Email', nonExistentEmail);
        await loginPage.login(nonExistentEmail, testData.newUser.password);
      });
    });

    await test.step('Step 3: Verify error message is shown', async () => {
      await step('Assert login error is visible', async () => {
        await expect(loginPage.loginError).toBeVisible();
        const errorText = await loginPage.getLoginErrorMessage();
        await attachment('Login Error Message', errorText, 'text/plain');
        expect(errorText.length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2.4  Login with blank fields → validation errors
  // ─────────────────────────────────────────────────────────────────────────────
  test('[2.4] Login with blank fields → validation errors', async ({ page }) => {
    await BASE_META();
    await story('As a user who submits an empty login form, I see field-level validation errors');
    await severity(Severity.CRITICAL);
    await tag('Login'); await tag('Regression'); await tag('Validation'); await tag('Negative');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that submitting the login form with all fields blank shows inline validation errors.</p>
      <h2>Expected Result</h2>
      <p>Validation error messages appear for the Email and/or Password fields.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();

    await test.step('Step 1: Navigate to /login', async () => {
      await step('Go to login page', async () => {
        await loginPage.goto();
        await expect(page).toHaveURL(/.*login/);
      });
    });

    await test.step('Step 2: Submit form without filling any fields', async () => {
      await step('Click Login button with blank fields', async () => {
        await loginPage.loginButton.click();
      });
    });

    await test.step('Step 3: Verify inline validation errors', async () => {
      await step('Assert Email or login error is visible', async () => {
        const emailErrorVisible = await loginPage.emailError.isVisible();
        const loginErrorVisible = await loginPage.loginError.isVisible();
        expect(emailErrorVisible || loginErrorVisible).toBe(true);
        if (emailErrorVisible) {
          const emailErr = await loginPage.emailError.innerText();
          await attachment('Email Validation Error', emailErr, 'text/plain');
        }
        if (loginErrorVisible) {
          const loginErr = await loginPage.getLoginErrorMessage();
          await attachment('Login Error Message', loginErr, 'text/plain');
        }
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2.5  "Remember me" checkbox persists session
  // ─────────────────────────────────────────────────────────────────────────────
  test('[2.5] "Remember me" checkbox persists session', async ({ page }) => {
    await BASE_META();
    await story('As a user checking "Remember me", my session is maintained after login');
    await severity(Severity.NORMAL);
    await tag('Login'); await tag('Regression'); await tag('Session');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that checking the "Remember me" checkbox before login results in a successful login
      and that the checkbox state is correctly toggled.</p>
      <h2>Expected Result</h2>
      <p>Login succeeds with "Remember me" checked and the user lands on the home page.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const homePage = pom.getHomePage();
    const credentials = CredentialManager.load();

    await attachment('Test Input', JSON.stringify({ email: credentials.email, rememberMe: true }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /login', async () => {
      await step('Go to login page', async () => {
        await loginPage.goto();
        await expect(page).toHaveURL(/.*login/);
      });
    });

    await test.step('Step 2: Verify Remember Me checkbox is present and check it', async () => {
      await step('Assert Remember Me checkbox is visible', async () => {
        await expect(loginPage.rememberMeCheckbox).toBeVisible();
      });
      await step('Check the Remember Me checkbox', async () => {
        await loginPage.rememberMeCheckbox.check();
        await expect(loginPage.rememberMeCheckbox).toBeChecked();
        await parameter('Remember Me', 'checked');
      });
    });

    await test.step('Step 3: Login with Remember Me checked', async () => {
      await step('Fill credentials and submit with rememberMe = true', async () => {
        await parameter('Email', credentials.email);
        await loginPage.login(credentials.email, credentials.password, true);
      });
    });

    await test.step('Step 4: Verify successful login', async () => {
      await step('Assert user lands on home page', async () => {
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
      });
      await step('Assert account link is visible', async () => {
        await expect(homePage.accountLink).toBeVisible();
        const accountText = await homePage.accountLink.innerText();
        await attachment('Logged-in Account', accountText, 'text/plain');
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2.6  Forgot password → receive recovery email confirmation
  // ─────────────────────────────────────────────────────────────────────────────
  test('[2.6] Forgot password → receive recovery email confirmation', async ({ page }) => {
    await BASE_META();
    await story('As a user who forgot their password, I can request a recovery email');
    await severity(Severity.NORMAL);
    await tag('Login'); await tag('Regression'); await tag('ForgotPassword');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that clicking "Forgot password?" navigates to the password recovery page
      and submitting a registered email shows a confirmation message.</p>
      <h2>Expected Result</h2>
      <p>A confirmation message is displayed indicating the recovery email has been sent.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const credentials = CredentialManager.load();

    await attachment('Test Input', JSON.stringify({ email: credentials.email }, null, 2), 'application/json');

    await test.step('Step 1: Navigate to /login and click Forgot Password', async () => {
      await step('Go to login page', async () => {
        await loginPage.goto();
        await expect(page).toHaveURL(/.*login/);
      });
      await step('Click "Forgot password?" link', async () => {
        await loginPage.forgotPasswordLink.click();
        await expect(page).toHaveURL(/.*passwordrecovery/);
      });
    });

    await test.step('Step 2: Enter registered email and submit recovery form', async () => {
      await step('Fill email and click Recover', async () => {
        await parameter('Email', credentials.email);
        const recoveryEmailInput = page.locator('#Email');
        const recoverButton = page.locator('input[value="Recover"]');
        await recoveryEmailInput.fill(credentials.email);
        await recoverButton.click();
      });
    });

    await test.step('Step 3: Verify recovery confirmation message', async () => {
      await step('Assert confirmation message is displayed', async () => {
        const resultMessage = page.locator('.result');
        await expect(resultMessage).toBeVisible();
        const resultText = await resultMessage.innerText();
        await attachment('Recovery Confirmation Message', resultText, 'text/plain');
        expect(resultText.length).toBeGreaterThan(0);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2.7  Logout successfully → redirected, session cleared
  // ─────────────────────────────────────────────────────────────────────────────
  test('[2.7] Logout successfully → redirected and session cleared', async ({ page }) => {
    await BASE_META();
    await story('As a logged-in user, I want to log out and have my session cleared');
    await severity(Severity.CRITICAL);
    await tag('Logout'); await tag('Regression'); await tag('Happy-Path');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that a logged-in user can successfully log out, is redirected to the home page,
      and the session is cleared (login link reappears, account link disappears).</p>
      <h2>Expected Result</h2>
      <p>User is redirected after logout and the header shows "Log in" instead of the account name.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();
    const homePage = pom.getHomePage();
    const credentials = CredentialManager.load();

    await test.step('Step 1: Login as a registered user', async () => {
      await step('Go to login page and submit valid credentials', async () => {
        await loginPage.goto();
        await parameter('Email', credentials.email);
        await loginPage.login(credentials.email, credentials.password);
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com\/?$/);
        await expect(homePage.accountLink).toBeVisible();
      });
    });

    await test.step('Step 2: Click Logout', async () => {
      await step('Click the logout link in the header', async () => {
        await homePage.logoutLink.click();
      });
    });

    await test.step('Step 3: Verify session is cleared', async () => {
      await step('Assert user is on home or logout page', async () => {
        await expect(page).toHaveURL(/.*demowebshop\.tricentis\.com/);
        await attachment('URL After Logout', page.url(), 'text/plain');
      });
      await step('Assert "Log in" link is visible (session cleared)', async () => {
        await expect(homePage.loginLink).toBeVisible();
      });
      await step('Assert account link is no longer visible', async () => {
        await expect(homePage.logoutLink).not.toBeVisible();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2.8  Access protected page (/customer/info) without login → redirect to login
  // ─────────────────────────────────────────────────────────────────────────────
  test('[2.8] Access protected page without login → redirect to login', async ({ page }) => {
    await BASE_META();
    await story('As an unauthenticated user, accessing a protected page redirects me to login');
    await severity(Severity.CRITICAL);
    await tag('Login'); await tag('Regression'); await tag('Security'); await tag('Authentication');

    await descriptionHtml(`
      <h2>Test Objective</h2>
      <p>Verify that navigating directly to the protected <code>/customer/info</code> page
      without being logged in redirects the user to the login page.</p>
      <h2>Expected Result</h2>
      <p>User is redirected to <code>/login</code> when accessing <code>/customer/info</code> unauthenticated.</p>
    `);

    const pom = new PageObjectManager(page);
    const loginPage = pom.getLoginPage();

    await test.step('Step 1: Attempt to navigate to /customer/info directly', async () => {
      await step('Go to /customer/info without being logged in', async () => {
        await page.goto('/customer/info');
        await attachment('Attempted URL', '/customer/info', 'text/plain');
      });
    });

    await test.step('Step 2: Verify redirect to login page', async () => {
      await step('Assert URL contains /login', async () => {
        await expect(page).toHaveURL(/.*login.*/);
        await attachment('Redirect URL', page.url(), 'text/plain');
      });
      await step('Assert login form is visible', async () => {
        await expect(loginPage.emailInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
      });
    });
  });

});
