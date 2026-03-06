import { Page, Locator } from '@playwright/test';

export class ComputersPage {
  readonly page: Page;

  // Page title
  readonly pageTitle: Locator;

  // Subcategory tiles
  readonly subcategoryItems: Locator;
  readonly desktopsLink: Locator;
  readonly notebooksLink: Locator;
  readonly accessoriesLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page title
    this.pageTitle = page.locator('.page-title h1');

    // Subcategory tiles
    this.subcategoryItems = page.locator('.sub-category-item');
    this.desktopsLink = page.getByRole('link', { name: 'Desktops' }).first();
    this.notebooksLink = page.getByRole('link', { name: 'Notebooks' }).first();
    this.accessoriesLink = page.getByRole('link', { name: 'Accessories' }).first();
  }

  async goto() {
    await this.page.goto('/computers');
  }

  async getSubcategoryCount(): Promise<number> {
    return await this.subcategoryItems.count();
  }

  async navigateToDesktops() {
    await this.desktopsLink.click();
  }

  async navigateToNotebooks() {
    await this.notebooksLink.click();
  }

  async navigateToAccessories() {
    await this.accessoriesLink.click();
  }

  async navigateToSubcategory(name: 'Desktops' | 'Notebooks' | 'Accessories') {
    await this.page.getByRole('link', { name }).first().click();
  }
}
