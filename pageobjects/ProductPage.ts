import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;

  // Product details
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productSKU: Locator;

  // Add to cart
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;

  // Add to wishlist / compare
  readonly addToWishlistButton: Locator;
  readonly addToCompareButton: Locator;

  // Notification bar (appears after adding to cart)
  readonly barNotification: Locator;
  readonly barNotificationMessage: Locator;
  readonly barNotificationClose: Locator;

  constructor(page: Page) {
    this.page = page;

    // Product details
    this.productName = page.locator('.product-name h1');
    this.productPrice = page.locator('.product-price span').first();
    this.productDescription = page.locator('.full-description');
    this.productSKU = page.locator('.sku .value');

    // Add to cart section
    this.quantityInput = page.locator('.qty-input');
    this.addToCartButton = page.locator('.add-to-cart-button');

    // Wishlist / Compare
    this.addToWishlistButton = page.locator('.add-to-wishlist-button');
    this.addToCompareButton = page.locator('.add-to-compare-list-button');

    // Bar notification shown at top of page
    this.barNotification = page.locator('#bar-notification');
    this.barNotificationMessage = page.locator('#bar-notification p');
    this.barNotificationClose = page.locator('#bar-notification .close');
  }

  async getProductName(): Promise<string> {
    return await this.productName.innerText();
  }

  async getProductPrice(): Promise<string> {
    return await this.productPrice.innerText();
  }

  async setQuantity(quantity: number) {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async waitForBarNotification() {
    await this.barNotification.waitFor({ state: 'visible' });
  }

  async getBarNotificationText(): Promise<string> {
    await this.waitForBarNotification();
    return await this.barNotificationMessage.innerText();
  }

  async closeBarNotification() {
    await this.barNotificationClose.click();
    await this.barNotification.waitFor({ state: 'hidden' });
  }
}
