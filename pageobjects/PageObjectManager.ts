import { Page } from '@playwright/test';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { CartPage } from './CartPage';
import { WishlistPage } from './WishlistPage';
import { BooksPage } from './BooksPage';
import { ComputersPage } from './ComputersPage';
import { ElectronicsPage } from './ElectronicsPage';
import { ApparelPage } from './ApparelPage';
import { DigitalDownloadsPage } from './DigitalDownloadsPage';
import { JewelryPage } from './JewelryPage';
import { GiftCardsPage } from './GiftCardsPage';
import { CameraPhotoPage } from './CameraPhotoPage';
import { CellPhonesPage } from './CellPhonesPage';
import { SearchResultsPage } from './SearchResultsPage';
import { ProductPage } from './ProductPage';
import { CheckoutPage } from './CheckoutPage';
import { OrderConfirmationPage } from './OrderConfirmationPage';

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
  private apparelPage: ApparelPage;
  private digitalDownloadsPage: DigitalDownloadsPage;
  private jewelryPage: JewelryPage;
  private giftCardsPage: GiftCardsPage;
  private cameraPhotoPage: CameraPhotoPage;
  private cellPhonesPage: CellPhonesPage;
  private searchResultsPage: SearchResultsPage;
  private productPage: ProductPage;
  private checkoutPage: CheckoutPage;
  private orderConfirmationPage: OrderConfirmationPage;

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
    this.apparelPage = new ApparelPage(page);
    this.digitalDownloadsPage = new DigitalDownloadsPage(page);
    this.jewelryPage = new JewelryPage(page);
    this.giftCardsPage = new GiftCardsPage(page);
    this.cameraPhotoPage = new CameraPhotoPage(page);
    this.cellPhonesPage = new CellPhonesPage(page);
    this.searchResultsPage = new SearchResultsPage(page);
    this.productPage = new ProductPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.orderConfirmationPage = new OrderConfirmationPage(page);
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

  getApparelPage(): ApparelPage {
    return this.apparelPage;
  }

  getDigitalDownloadsPage(): DigitalDownloadsPage {
    return this.digitalDownloadsPage;
  }

  getJewelryPage(): JewelryPage {
    return this.jewelryPage;
  }

  getGiftCardsPage(): GiftCardsPage {
    return this.giftCardsPage;
  }

  getCameraPhotoPage(): CameraPhotoPage {
    return this.cameraPhotoPage;
  }

  getCellPhonesPage(): CellPhonesPage {
    return this.cellPhonesPage;
  }

  getSearchResultsPage(): SearchResultsPage {
    return this.searchResultsPage;
  }

  getProductPage(): ProductPage {
    return this.productPage;
  }

  getCheckoutPage(): CheckoutPage {
    return this.checkoutPage;
  }

  getOrderConfirmationPage(): OrderConfirmationPage {
    return this.orderConfirmationPage;
  }
}
