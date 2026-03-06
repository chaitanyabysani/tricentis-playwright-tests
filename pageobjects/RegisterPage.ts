import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;

  // Gender
  readonly genderMaleRadio: Locator;
  readonly genderFemaleRadio: Locator;

  // Personal details
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;

  // Password
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;

  // Submit
  readonly registerButton: Locator;

  // Result
  readonly registerResultMessage: Locator;
  readonly continueButton: Locator;

  // Validation error messages
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly confirmPasswordError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Gender
    this.genderMaleRadio = page.locator('#gender-male');
    this.genderFemaleRadio = page.locator('#gender-female');

    // Personal details
    this.firstNameInput = page.locator('#FirstName');
    this.lastNameInput = page.locator('#LastName');
    this.emailInput = page.locator('#Email');

    // Password
    this.passwordInput = page.locator('#Password');
    this.confirmPasswordInput = page.locator('#ConfirmPassword');

    // Submit
    this.registerButton = page.locator('#register-button');

    // Result
    this.registerResultMessage = page.locator('.result');
    this.continueButton = page.getByRole('link', { name: 'Continue' });

    // Validation errors
    this.firstNameError = page.locator('#FirstName-error');
    this.lastNameError = page.locator('#LastName-error');
    this.emailError = page.locator('#Email-error');
    this.passwordError = page.locator('#Password-error');
    this.confirmPasswordError = page.locator('#ConfirmPassword-error');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async register(
    gender: 'male' | 'female',
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    if (gender === 'male') {
      await this.genderMaleRadio.click();
    } else {
      await this.genderFemaleRadio.click();
    }

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.registerButton.click();
  }

  async getRegistrationResult(): Promise<string> {
    return await this.registerResultMessage.innerText();
  }
}
