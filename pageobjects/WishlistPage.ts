import { Page, Locator } from '@playwright/test';

export class WishlistPage {
  readonly page: Page;

  // Wishlist table
  readonly wishlistTable: Locator;
  readonly wishlistItems: Locator;
  readonly emptyWishlistMessage: Locator;

  // Per wishlist item elements (use .nth(index) to target specific rows)
  readonly itemProductNames: Locator;
  readonly itemUnitPrices: Locator;
  readonly itemQuantityInputs: Locator;
  readonly itemSubtotals: Locator;
  readonly itemAddToCartCheckboxes: Locator;
  readonly itemRemoveCheckboxes: Locator;

  // Wishlist actions
  readonly updateWishlistButton: Locator;
  readonly addToCartButton: Locator;
  readonly continueShoppingButton: Locator;

  // Share wishlist
  readonly shareWishlistUrl: Locator;

  constructor(page: Page) {
    this.page = page;

    // Wishlist table
    this.wishlistTable = page.locator('.wishlist');
    this.wishlistItems = page.locator('.wishlist tbody tr');
    this.emptyWishlistMessage = page.locator('.no-data');

    // Per wishlist item elements
    this.itemProductNames = page.locator('.wishlist .product-name a');
    this.itemUnitPrices = page.locator('.wishlist .unit-price .product-unit-price');
    this.itemQuantityInputs = page.locator('.wishlist .qty-input');
    this.itemSubtotals = page.locator('.wishlist .subtotal .product-subtotal');
    this.itemAddToCartCheckboxes = page.locator('.wishlist .add-to-cart input[type="checkbox"]');
    this.itemRemoveCheckboxes = page.locator('.wishlist .remove-from-wishlist input[type="checkbox"]');

    // Wishlist actions
    this.updateWishlistButton = page.locator('#updatewishlist');
    this.addToCartButton = page.locator('.wishlist-add-to-cart-button');
    this.continueShoppingButton = page.locator('.continue-shopping-button');

    // Share wishlist
    this.shareWishlistUrl = page.locator('.wishlist-url-input');
  }

  async goto() {
    await this.page.goto('/wishlist');
  }

  async isWishlistEmpty(): Promise<boolean> {
    return await this.emptyWishlistMessage.isVisible();
  }

  async getWishlistItemCount(): Promise<number> {
    return await this.wishlistItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return await this.itemProductNames.allTextContents();
  }

  async updateItemQuantity(index: number, quantity: number) {
    await this.itemQuantityInputs.nth(index).fill(String(quantity));
    await this.updateWishlistButton.click();
  }

  async removeItem(index: number) {
    await this.itemRemoveCheckboxes.nth(index).check();
    await this.updateWishlistButton.click();
  }

  async addItemToCart(index: number) {
    await this.itemAddToCartCheckboxes.nth(index).check();
    await this.addToCartButton.click();
  }

  async addAllItemsToCart() {
    const checkboxes = await this.itemAddToCartCheckboxes.all();
    for (const checkbox of checkboxes) {
      await checkbox.check();
    }
    await this.addToCartButton.click();
  }

  async getShareableUrl(): Promise<string> {
    return await this.shareWishlistUrl.inputValue();
  }
}
