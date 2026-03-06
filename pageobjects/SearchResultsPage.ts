import { Page, Locator } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;

  // Search bar
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  // Page title / heading
  readonly pageTitle: Locator;
  readonly searchResultsHeading: Locator;

  // Results
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly addToCartButtons: Locator;
  readonly addToWishlistButtons: Locator;
  readonly addToCompareButtons: Locator;

  // No results message
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Search bar (in-page search form on /search)
    this.searchInput = page.locator('#q');
    this.searchButton = page.locator('.search-button');

    // Headings
    this.pageTitle = page.locator('.page-title h1');
    this.searchResultsHeading = page.locator('.search-results');

    // Product listings
    this.productItems = page.locator('.product-item');
    this.productNames = page.locator('.product-item .product-title a');
    this.productPrices = page.locator('.product-item .actual-price');
    this.addToCartButtons = page.locator('.product-item .product-box-add-to-cart-button');
    this.addToWishlistButtons = page.locator('.product-item .add-to-wishlist-button');
    this.addToCompareButtons = page.locator('.product-item .add-to-compare-list-button');

    // Empty state
    this.noResultsMessage = page.locator('.no-result');
  }

  async goto(searchTerm?: string) {
    if (searchTerm) {
      await this.page.goto(`/search?q=${encodeURIComponent(searchTerm)}`);
    } else {
      await this.page.goto('/search');
    }
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  async clickProduct(productName: string) {
    await this.productNames.filter({ hasText: productName }).first().click();
  }

  async addProductToCartByIndex(index: number) {
    await this.addToCartButtons.nth(index).click();
  }

  async addProductToCartByName(productName: string) {
    const productItem = this.productItems.filter({ hasText: productName });
    await productItem.locator('.product-box-add-to-cart-button').click();
  }

  async hasResults(): Promise<boolean> {
    const count = await this.productItems.count();
    return count > 0;
  }
}
