import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Form fields
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;

  // Buttons & links
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;

  // Validation & error messages
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form fields
    this.emailInput = page.locator('#Email');
    this.passwordInput = page.locator('#Password');
    this.rememberMeCheckbox = page.locator('#RememberMe');

    // Buttons & links
    this.loginButton = page.locator('.login-button');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.registerLink = page.getByRole('link', { name: 'Register' });

    // Validation & error messages
    this.emailError = page.locator('#Email-error');
    this.passwordError = page.locator('#Password-error');
    this.loginError = page.locator('.validation-summary-errors');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string, rememberMe = false) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    await this.loginButton.click();
  }

  async getLoginErrorMessage(): Promise<string> {
    return await this.loginError.innerText();
  }
}
