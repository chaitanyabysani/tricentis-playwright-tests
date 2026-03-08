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
    // Strategy 1: extract "Order number: <digits>" from the whole .order-completed section
    try {
      const sectionText = await this.orderCompletedSection.textContent();
      if (sectionText) {
        const match = sectionText.match(/[Oo]rder\s+[Nn]umber[\s:#]*(\d+)/);
        if (match) return match[1];
      }
    } catch {}

    // Strategy 2: any <strong> inside .order-completed .details
    try {
      const el = this.page.locator('.order-completed .details strong, .order-completed strong');
      if (await el.count() > 0) {
        const text = await el.first().textContent();
        if (text?.trim().match(/^\d+$/)) return text.trim();
      }
    } catch {}

    // Strategy 3: dedicated class selectors
    for (const selector of ['.order-number strong', '.order-number', '.details-value']) {
      try {
        const el = this.page.locator(selector);
        if (await el.count() > 0) {
          const text = await el.first().textContent();
          if (text) {
            const match = text.match(/\d+/);
            if (match) return match[0];
          }
        }
      } catch {}
    }

    // Strategy 4: URL fallback for shops that embed order ID in URL
    const url = this.page.url();
    const urlMatch = url.match(/\/(\d+)\/?$/);
    if (urlMatch) return urlMatch[1];

    return 'Order number not found';
  }

  async continueShopping() {
    await this.continueButton.click();
  }
}
