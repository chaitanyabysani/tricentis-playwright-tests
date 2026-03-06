import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { CartPage } from './CartPage';
import { WishlistPage } from './WishlistPage';
import { BooksPage } from './BooksPage';
import { ComputersPage } from './ComputersPage';
import { ElectronicsPage } from './ElectronicsPage';

export class PageObjectManager {
  readonly page: Page;

  private homePage: HomePage;
  private loginPage: LoginPage;
  private registerPage: RegisterPage;
  private cartPage: CartPage;
  private wishlistPage: WishlistPage;
  private booksPage: BooksPage;
  private computersPage: ComputersPage;
  private electronicsPage: ElectronicsPage;

  constructor(page: Page) {
    this.page = page;

    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.registerPage = new RegisterPage(page);
    this.cartPage = new CartPage(page);
    this.wishlistPage = new WishlistPage(page);
    this.booksPage = new BooksPage(page);
    this.computersPage = new ComputersPage(page);
    this.electronicsPage = new ElectronicsPage(page);
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

  getWishlistPage(): WishlistPage {
    return this.wishlistPage;
  }

  getBooksPage(): BooksPage {
    return this.booksPage;
  }

  getComputersPage(): ComputersPage {
    return this.computersPage;
  }

  getElectronicsPage(): ElectronicsPage {
    return this.electronicsPage;
  }
}
