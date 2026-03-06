import { Page, Locator } from '@playwright/test';

export class BooksPage {
  readonly page: Page;

  // Page title
  readonly pageTitle: Locator;

  // Product listings
  readonly productItems: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly productOldPrices: Locator;
  readonly addToCartButtons: Locator;
  readonly addToWishlistButtons: Locator;
  readonly addToCompareButtons: Locator;

  // View mode
  readonly gridViewButton: Locator;
  readonly listViewButton: Locator;

  // Sort & page size
  readonly sortByDropdown: Locator;
  readonly pageSizeDropdown: Locator;

  // Price filters
  readonly priceFilterUnder25: Locator;
  readonly priceFilter25To50: Locator;
  readonly priceFilterOver50: Locator;

  // Pagination
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;
  readonly pagerItems: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page title
    this.pageTitle = page.locator('.page-title h1');

    // Product listings
    this.productItems = page.locator('.product-item');
    this.productNames = page.locator('.product-item .product-title a');
    this.productPrices = page.locator('.product-item .actual-price');
    this.productOldPrices = page.locator('.product-item .old-price');
    this.addToCartButtons = page.locator('.product-item .button-2.product-box-add-to-cart-button');
    this.addToWishlistButtons = page.locator('.product-item .add-to-wishlist-button');
    this.addToCompareButtons = page.locator('.product-item .add-to-compare-list-button');

    // View mode
    this.gridViewButton = page.locator('.viewmode-icon.grid');
    this.listViewButton = page.locator('.viewmode-icon.list');

    // Sort & page size
    this.sortByDropdown = page.locator('#products-orderby');
    this.pageSizeDropdown = page.locator('#products-pagesize');

    // Price filters
    this.priceFilterUnder25 = page.getByRole('link', { name: 'Under $25.00' });
    this.priceFilter25To50 = page.getByRole('link', { name: '$25.00 - $50.00' });
    this.priceFilterOver50 = page.getByRole('link', { name: 'Over $50.00' });

    // Pagination
    this.nextPageButton = page.locator('.pager .next-page');
    this.prevPageButton = page.locator('.pager .previous-page');
    this.pagerItems = page.locator('.pager li');
  }

  async goto() {
    await this.page.goto('/books');
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return await this.productPrices.allTextContents();
  }

  async clickProduct(productName: string) {
    await this.page.getByRole('link', { name: productName }).first().click();
  }

  async addProductToCartByIndex(index: number) {
    await this.addToCartButtons.nth(index).click();
  }

  async addProductToWishlistByIndex(index: number) {
    await this.addToWishlistButtons.nth(index).click();
  }

  async sortBy(option: 'position' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'created-on') {
    await this.sortByDropdown.selectOption(option);
  }

  async setPageSize(size: '4' | '8' | '12') {
    await this.pageSizeDropdown.selectOption(size);
  }

  async filterByPriceUnder25() {
    await this.priceFilterUnder25.click();
  }

  async filterByPrice25To50() {
    await this.priceFilter25To50.click();
  }

  async filterByPriceOver50() {
    await this.priceFilterOver50.click();
  }

  async switchToGridView() {
    await this.gridViewButton.click();
  }

  async switchToListView() {
    await this.listViewButton.click();
  }
}
