import { Page, Locator } from '@playwright/test';

export class OrderConfirmationPage {
  readonly page: Page;

  // Page title
  readonly pageTitle: Locator;

  // Order completed section
  readonly orderCompletedSection: Locator;
  readonly successTitle: Locator;
  readonly orderNumberLabel: Locator;
  readonly orderNumberValue: Locator;

  // Continue button
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page heading
    this.pageTitle = page.locator('.page-title h1');

    // Order completed content
    this.orderCompletedSection = page.locator('.order-completed');
    this.successTitle = page.locator('.order-completed .title strong');
    this.orderNumberLabel = page.locator('.order-number');
    // The order number value may be in a <strong>, a sibling div, or just text
    this.orderNumberValue = page.locator('.order-number strong, .details-value').first();

    // Continue shopping button
    this.continueButton = page.locator('.order-completed-continue-button');
  }

  async isOrderSuccessful(): Promise<boolean> {
    return await this.orderCompletedSection.isVisible();
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successTitle.innerText();
  }

  async getOrderNumber(): Promise<string> {
    // Try structured elements first
    const strongVisible = await this.orderNumberValue.isVisible().catch(() => false);
    if (strongVisible) {
      return await this.orderNumberValue.innerText();
    }
    const labelVisible = await this.orderNumberLabel.isVisible().catch(() => false);
    if (labelVisible) {
      const text = await this.orderNumberLabel.innerText();
      const match = text.match(/\d+/);
      return match ? match[0] : text.trim();
    }
    // Fallback: extract order ID from the current URL (e.g. /checkout/completed/12345)
    const url = this.page.url();
    const urlMatch = url.match(/\/(\d+)\/?$/);
    if (urlMatch) return urlMatch[1];
    return url;
  }

  async continueShopping() {
    await this.continueButton.click();
  }
}
