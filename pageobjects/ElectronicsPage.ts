import { Page, Locator } from '@playwright/test';

export class ElectronicsPage {
  readonly page: Page;

  // Page title
  readonly pageTitle: Locator;

  // Subcategory tiles
  readonly subcategoryItems: Locator;
  readonly cameraPhotoLink: Locator;
  readonly cellPhonesLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page title
    this.pageTitle = page.locator('.page-title h1');

    // Subcategory tiles
    this.subcategoryItems = page.locator('.sub-category-item');
    this.cameraPhotoLink = page.getByRole('link', { name: 'Camera, photo' }).first();
    this.cellPhonesLink = page.getByRole('link', { name: 'Cell phones' }).first();
  }

  async goto() {
    await this.page.goto('/electronics');
  }

  async getSubcategoryCount(): Promise<number> {
    return await this.subcategoryItems.count();
  }

  async navigateToCameraPhoto() {
    await this.cameraPhotoLink.click();
  }

  async navigateToCellPhones() {
    await this.cellPhonesLink.click();
  }

  async navigateToSubcategory(name: 'Camera, photo' | 'Cell phones') {
    await this.page.getByRole('link', { name }).first().click();
  }
}
