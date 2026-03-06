import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';

export class PageObjectManager {
  readonly page: Page;

  private homePage: HomePage;
  private loginPage: LoginPage;
  private registerPage: RegisterPage;

  constructor(page: Page) {
    this.page = page;

    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.registerPage = new RegisterPage(page);
  }

  getHomePage(): HomePage {
    return this.homePage;
  }

  getLoginPage(): LoginPage {
    return this.loginPage;
  }

  getRegisterPage(): RegisterPage {
    return this.registerPage;
  }
}
