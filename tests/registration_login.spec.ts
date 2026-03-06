import { test, expect } from '@playwright/test';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import { CredentialManager } from '../utils/CredentialManager';
import testData from '../utils/testdata.json';

test('E2E: Register a new user and login with saved credentials', async ({ page }) => {
  const pom = new PageObjectManager(page);
  const registerPage = pom.getRegisterPage();
  const loginPage = pom.getLoginPage();

  // Generate unique email using timestamp to avoid duplicate registration
  const uniqueEmail = `${testData.newUser.emailPrefix}+${Date.now()}@test.com`;
  const password = testData.newUser.password;

  // Step 1: Register new user
  await test.step('Register new user', async () => {
    await registerPage.goto();
    await registerPage.register(
      testData.newUser.gender as 'male' | 'female',
      testData.newUser.firstName,
      testData.newUser.lastName,
      uniqueEmail,
      password
    );

    const result = await registerPage.getRegistrationResult();
    expect(result).toContain('Your registration completed');

    // Save credentials for reuse in other tests
    CredentialManager.save({ email: uniqueEmail, password });
  });

  // Step 2: Navigate to login page
  await test.step('Navigate to login page', async () => {
    await loginPage.goto();
    await expect(page).toHaveURL(/.*login/);
  });

  // Step 3: Login with saved credentials
  await test.step('Login with registered credentials', async () => {
    const credentials = CredentialManager.load();
    await loginPage.login(credentials.email, credentials.password);

    // Verify successful login — account link is visible after login
    await expect(page.locator('.account')).toBeVisible();
    await expect(page.locator('.ico-logout')).toBeVisible();
  });
});
