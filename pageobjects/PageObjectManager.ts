import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { CartPage } from './CartPage';

export class PageObjectManager {
  readonly page: Page;

  private homePage: HomePage;
  private loginPage: LoginPage;
  private registerPage: RegisterPage;
  private cartPage: CartPage;

  constructor(page: Page) {
    this.page = page;

    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.registerPage = new RegisterPage(page);
    this.cartPage = new CartPage(page);
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

  getCartPage(): CartPage {
    return this.cartPage;
  }
}
