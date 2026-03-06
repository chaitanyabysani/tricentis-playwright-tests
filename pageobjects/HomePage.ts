import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  // Header
  readonly registerLink: Locator;
  readonly loginLink: Locator;
  readonly accountLink: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;
  readonly wishlistLink: Locator;
  readonly logoLink: Locator;

  // Search
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  // Navigation menu
  readonly booksMenu: Locator;
  readonly computersMenu: Locator;
  readonly electronicsMenu: Locator;
  readonly apparelMenu: Locator;
  readonly digitalDownloadsMenu: Locator;
  readonly jewelryMenu: Locator;
  readonly giftCardsMenu: Locator;

  // Newsletter
  readonly newsletterEmailInput: Locator;
  readonly newsletterSubscribeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.registerLink = page.getByRole('link', { name: 'Register' });
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.accountLink = page.locator('.account').first();
    this.logoutLink = page.locator('.ico-logout');
    this.cartLink = page.locator('.cart-qty');
    this.wishlistLink = page.locator('.wishlist-qty');
    this.logoLink = page.locator('.header-logo a');

    // Search
    this.searchInput = page.locator('#small-searchterms');
    this.searchButton = page.locator('.search-box button[type="submit"]');

    // Navigation menu
    this.booksMenu = page.getByRole('link', { name: 'Books' });
    this.computersMenu = page.getByRole('link', { name: 'Computers' });
    this.electronicsMenu = page.getByRole('link', { name: 'Electronics' });
    this.apparelMenu = page.getByRole('link', { name: 'Apparel & Shoes' });
    this.digitalDownloadsMenu = page.getByRole('link', { name: 'Digital downloads' });
    this.jewelryMenu = page.getByRole('link', { name: 'Jewelry' });
    this.giftCardsMenu = page.getByRole('link', { name: 'Gift Cards' });

    // Newsletter
    this.newsletterEmailInput = page.locator('#newsletter-email');
    this.newsletterSubscribeButton = page.locator('#newsletter-subscribe-button');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async navigateToCategory(category: string) {
    await this.page.getByRole('link', { name: category }).first().click();
  }

  async subscribeNewsletter(email: string) {
    await this.newsletterEmailInput.fill(email);
    await this.newsletterSubscribeButton.click();
  }

  async getFeaturedProductNames(): Promise<string[]> {
    const products = this.page.locator('.product-item .product-title a');
    return await products.allTextContents();
  }

  async clickFeaturedProduct(productName: string) {
    await this.page.getByRole('link', { name: productName }).click();
  }
}
