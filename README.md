# Tricentis Demo Web Shop — Playwright Test Automation

Automated end-to-end test suite for [https://demowebshop.tricentis.com](https://demowebshop.tricentis.com) built with **Playwright** and **TypeScript**, following the **Page Object Model (POM)** design pattern.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Page Objects](#page-objects)
- [Utilities](#utilities)
- [Test Scenarios](#test-scenarios)
- [Comprehensive Test Scenario Coverage](#comprehensive-test-scenario-coverage)
- [Allure Report Basics Test Suite](#allure-report-basics-test-suite)
- [NPM Scripts](#npm-scripts)
- [Running Tests](#running-tests)
- [Reports](#reports)
- [Allure Report Details](#allure-report-details)
- [.gitignore](#gitignore)
- [How to Add a New Test](#how-to-add-a-new-test)

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev/) | ^1.58.2 | Browser automation framework |
| TypeScript | ^5.9 | Strongly-typed test scripting |
| [allure-playwright](https://www.npmjs.com/package/allure-playwright) | ^3.6.0 | Allure reporter integration for Playwright |
| [allure-commandline](https://www.npmjs.com/package/allure-commandline) | ^2.37.0 | CLI to generate and open Allure reports |
| HTML Reporter | built-in | Built-in Playwright HTML test report |
| Node.js | v18+ | Runtime environment |

---

## Project Structure

```
tricentis-playwright-tests/
│
├── pageobjects/                        # Page Object classes
│   ├── HomePage.ts                     # Home page — header, nav, search, newsletter
│   ├── LoginPage.ts                    # Login page — form, validation errors
│   ├── RegisterPage.ts                 # Register page — form, validation errors
│   ├── CartPage.ts                     # Shopping cart — items, totals, estimate shipping, checkout
│   ├── WishlistPage.ts                 # Wishlist — items, add to cart, share URL
│   ├── BooksPage.ts                    # Books category — products, filters, sort, pagination
│   ├── ComputersPage.ts                # Computers category — subcategory tiles
│   ├── ElectronicsPage.ts              # Electronics category — subcategory tiles
│   ├── ApparelPage.ts                  # Apparel & Shoes category — products, sort, pagination
│   ├── DigitalDownloadsPage.ts         # Digital Downloads category — products, sort
│   ├── JewelryPage.ts                  # Jewelry category — products, price filters
│   ├── GiftCardsPage.ts                # Gift Cards category — products, sort
│   ├── CameraPhotoPage.ts              # Camera & Photo sub-category — products, price filters
│   ├── CellPhonesPage.ts               # Cell Phones sub-category — products, sort
│   ├── SearchResultsPage.ts            # Search results — product listing, add to cart
│   ├── ProductPage.ts                  # Product detail — add to cart, bar notification
│   ├── CheckoutPage.ts                 # One-page checkout — billing, shipping, payment, confirm
│   ├── OrderConfirmationPage.ts        # Thank You page — order number, success message
│   └── PageObjectManager.ts            # Central manager for all page objects
│
├── tests/                              # Test spec files
│   ├── example.spec.ts                          # Default Playwright sample test
│   ├── registration.spec.ts                     # Registration only — saves credentials
│   ├── registration_login.spec.ts               # E2E: Registration + Login scenario
│   ├── e2e_flow/
│   │   └── e2e_purchase_flow.spec.ts            # E2E: Full purchase flow (17 steps incl. Step 0)
│   ├── user_registration.spec.ts                # Module 1 — User Registration (8 scenarios)
│   ├── user_authentication.spec.ts              # Module 2 — Login / Logout (8 scenarios)
│   ├── home_page.spec.ts                        # Module 3 — Home Page (9 scenarios)
│   ├── product_search.spec.ts                   # Module 4 — Product Search (12 scenarios)
│   ├── category_books.spec.ts                   # Module 5A — Books (8 scenarios)
│   ├── category_computers.spec.ts               # Module 5B — Computers (7 scenarios)
│   ├── category_electronics.spec.ts             # Module 5C — Electronics (5 scenarios)
│   ├── category_apparel.spec.ts                 # Module 5D — Apparel & Shoes (5 scenarios)
│   ├── category_digital_downloads.spec.ts       # Module 5E — Digital Downloads (3 scenarios)
│   ├── category_jewelry.spec.ts                 # Module 5F — Jewelry (4 scenarios)
│   ├── category_gift_cards.spec.ts              # Module 5G — Gift Cards (4 scenarios)
│   ├── product_detail_page.spec.ts              # Module 6 — Product Detail Page (12 scenarios)
│   ├── shopping_cart.spec.ts                    # Module 7 — Shopping Cart (13 scenarios)
│   ├── checkout_flow.spec.ts                    # Module 8 — Checkout Flow (13 scenarios)
│   ├── my_account.spec.ts                       # Module 9 — My Account (12 scenarios)
│   ├── wishlist.spec.ts                         # Module 10 — Wishlist (7 scenarios)
│   └── allure-report-basics/                    # Allure annotation demo/learning suite
│       ├── 01_basic_description_severity.spec.ts
│       ├── 02_allure_steps.spec.ts
│       ├── 03_screenshots_attachment.spec.ts
│       ├── 04_epic_feature_story.spec.ts
│       ├── 05_allure_parameters.spec.ts
│       ├── 06_allure_attachments.spec.ts
│       ├── 07_allure_with_hooks.spec.ts
│       ├── 08_allure_links.spec.ts
│       ├── 09_complete_example.spec.ts
│       └── README.md
│
├── utils/                              # Utilities and test data
│   ├── testdata.json                   # Static input data for tests
│   ├── credentials.json                # Runtime-saved user credentials (array, appended)
│   └── CredentialManager.ts            # Helper to save/load/loadAll credentials
│
├── global-setup.ts                     # Writes environment.properties to allure-results/ before each run
├── playwright.config.ts                # Playwright configuration
├── tsconfig.json                       # TypeScript compiler configuration
├── package.json                        # Dependencies and npm scripts
├── CLAUDE.md                           # Claude Code project instructions
└── README.md                           # Project documentation
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

---

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/chaitanyabysani/tricentis-playwright-tests.git
cd tricentis-playwright-tests
```

**2. Install dependencies**

```bash
npm install
```

**3. Install Playwright browsers**

```bash
npx playwright install
```

---

## Configuration

### `playwright.config.ts`

| Setting | Value |
|---|---|
| Base URL | `https://demowebshop.tricentis.com/` |
| Browser | Chromium |
| Headless | `false` |
| Test timeout | 30 seconds |
| Expect timeout | 5 seconds |
| Retries | 0 |
| Screenshots | On (all tests) |
| Video | On (all tests) |
| Trace | On (all tests) |
| Reporters | HTML, Line, Allure |
| Global Setup | `global-setup.ts` — writes `allure-results/environment.properties` |

### `tsconfig.json`

| Setting | Value | Reason |
|---|---|---|
| `target` | `ES2020` | Modern JS output |
| `module` | `node16` | Required for allure-playwright module resolution |
| `moduleResolution` | `node16` | Resolves allure-js-commons sub-path exports |
| `lib` | `ES2020`, `DOM` | Includes DOM types required by Playwright |
| `resolveJsonModule` | `true` | Allows importing `.json` files directly |
| `esModuleInterop` | `true` | Simplifies CommonJS default imports |
| `skipLibCheck` | `true` | Skips type checking inside node_modules |

---

## Page Objects

All page object files are in the `pageobjects/` folder.

---

### HomePage (`pageobjects/HomePage.ts`)

Covers the main landing page of the shop.

| Element | Selector | Description |
|---|---|---|
| `registerLink` | `getByRole('link', { name: 'Register' })` | Header Register link |
| `loginLink` | `getByRole('link', { name: 'Log in' })` | Header Log in link |
| `accountLink` | `.account` (first match) | Account link visible after login |
| `logoutLink` | `.ico-logout` | Logout button visible after login |
| `cartLink` | `.cart-qty` | Shopping cart indicator with count |
| `wishlistLink` | `.wishlist-qty` | Wishlist indicator |
| `searchInput` | `#small-searchterms` | Header search bar input |
| `searchButton` | `.search-box-button` | Search submit button |
| `booksMenu` | `getByRole('link', { name: 'Books' })` | Books nav link |
| `computersMenu` | `getByRole('link', { name: 'Computers' })` | Computers nav link |
| `electronicsMenu` | `getByRole('link', { name: 'Electronics' })` | Electronics nav link |
| `apparelMenu` | `getByRole('link', { name: 'Apparel & Shoes' })` | Apparel nav link |
| `digitalDownloadsMenu` | `getByRole('link', { name: 'Digital downloads' })` | Digital downloads nav link |
| `jewelryMenu` | `getByRole('link', { name: 'Jewelry' })` | Jewelry nav link |
| `giftCardsMenu` | `getByRole('link', { name: 'Gift Cards' })` | Gift Cards nav link |

| Method | Description |
|---|---|
| `goto()` | Navigate to home page |
| `search(term)` | Fill search input and press Enter |
| `navigateToCategory(category)` | Click a navigation menu category |
| `subscribeNewsletter(email)` | Subscribe to newsletter |
| `getFeaturedProductNames()` | Returns all featured product name strings |
| `clickFeaturedProduct(name)` | Click a featured product by name |

---

### LoginPage (`pageobjects/LoginPage.ts`)

Covers the `/login` page.

| Element | Selector | Description |
|---|---|---|
| `emailInput` | `#Email` | Email address input |
| `passwordInput` | `#Password` | Password input |
| `rememberMeCheckbox` | `#RememberMe` | Remember me checkbox |
| `loginButton` | `.login-button` | Login submit button |
| `forgotPasswordLink` | `getByRole('link', { name: 'Forgot password?' })` | Forgot password link |
| `emailError` | `#Email-error` | Email field validation error |
| `passwordError` | `#Password-error` | Password field validation error |
| `loginError` | `.validation-summary-errors` | Login summary error message |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/login` |
| `login(email, password, rememberMe?)` | Fill and submit login form |
| `getLoginErrorMessage()` | Returns the login error summary text |

---

### RegisterPage (`pageobjects/RegisterPage.ts`)

Covers the `/register` page.

| Element | Selector | Description |
|---|---|---|
| `genderMaleRadio` | `#gender-male` | Male gender radio button |
| `genderFemaleRadio` | `#gender-female` | Female gender radio button |
| `firstNameInput` | `#FirstName` | First name input |
| `lastNameInput` | `#LastName` | Last name input |
| `emailInput` | `#Email` | Email input |
| `passwordInput` | `#Password` | Password input |
| `confirmPasswordInput` | `#ConfirmPassword` | Confirm password input |
| `registerButton` | `#register-button` | Register submit button |
| `registerResultMessage` | `.result` | Success/failure result message |
| `continueButton` | `getByRole('link', { name: 'Continue' })` | Continue link after registration |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/register` |
| `register(gender, firstName, lastName, email, password)` | Fill and submit registration form |
| `getRegistrationResult()` | Returns the registration result message text |

---

### CartPage (`pageobjects/CartPage.ts`)

Covers the `/cart` page including the estimate shipping section.

| Element | Selector | Description |
|---|---|---|
| `cartTable` | `.cart` | Cart items table |
| `cartItems` | `.cart tbody tr` | All cart item rows |
| `emptyCartMessage` | `.no-data` | Empty cart message |
| `itemProductNames` | `.cart td.product a` | Product name links in cart |
| `itemUnitPrices` | `.cart .unit-price .product-unit-price` | Unit price per item |
| `itemQuantityInputs` | `.cart .qty-input` | Quantity inputs |
| `itemSubtotals` | `.cart .subtotal .product-subtotal` | Subtotal per item |
| `itemRemoveCheckboxes` | `.cart .remove-from-cart input[type="checkbox"]` | Remove item checkboxes |
| `updateCartButton` | `#updatecart` | Update cart button |
| `continueShoppingButton` | `.continue-shopping-button` | Continue shopping link |
| `checkoutButton` | `#checkout` | Proceed to checkout button |
| `couponCodeInput` | `#couponcode` | Coupon code input |
| `applyCouponButton` | `#applycouponbutton` | Apply coupon button |
| `giftCardInput` | `#giftcardcouponcode` | Gift card input |
| `applyGiftCardButton` | `#applygiftcardcouponcode` | Apply gift card button |
| `subTotal` | `.order-subtotal td:last-child` | Order subtotal |
| `shipping` | `.shipping-cost td:last-child` | Shipping cost |
| `orderTotal` | `.order-total td:last-child` | Order total |
| `termsOfServiceCheckbox` | `#termsofservice` | Terms of service checkbox |
| `estimateShippingCountry` | `#CountryId` | Estimate shipping — country dropdown |
| `estimateShippingState` | `#StateProvinceId` | Estimate shipping — state dropdown |
| `estimateShippingZip` | `#ZipPostalCode` | Estimate shipping — zip code input |
| `estimateShippingButton` | `.estimate-shipping-button` | Estimate shipping submit button |
| `shippingResultsSection` | `.shipping-results` | Shipping options result section |
| `shippingOptionItems` | `.shipping-results li` | Individual shipping option rows |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/cart` |
| `isCartEmpty()` | Returns `true` if cart is empty |
| `getCartItemCount()` | Returns number of items in cart |
| `getProductNames()` | Returns all product name strings (waits for cart table) |
| `getOrderTotal()` | Returns order total text |
| `updateItemQuantity(index, qty)` | Updates quantity for item at index |
| `removeItem(index)` | Removes item at index from cart |
| `applyCoupon(code)` | Applies a coupon code |
| `applyGiftCard(code)` | Applies a gift card code |
| `proceedToCheckout()` | Accepts terms and clicks checkout |
| `estimateShipping(country, state, zip)` | Selects country/state, enters zip, clicks estimate, waits for results |
| `getShippingOptions()` | Returns shipping option texts from results section |
| `getHeaderCartCount()` | Returns cart count text from header (e.g. `(1)`) |

---

### WishlistPage (`pageobjects/WishlistPage.ts`)

Covers the `/wishlist` page.

| Element | Selector | Description |
|---|---|---|
| `wishlistTable` | `.wishlist` | Wishlist items table |
| `wishlistItems` | `.wishlist tbody tr` | All wishlist item rows |
| `emptyWishlistMessage` | `.no-data` | Empty wishlist message |
| `itemProductNames` | `.wishlist .product-name a` | Product name links |
| `itemUnitPrices` | `.wishlist .unit-price .product-unit-price` | Unit price per item |
| `itemQuantityInputs` | `.wishlist .qty-input` | Quantity inputs |
| `itemAddToCartCheckboxes` | `.wishlist .add-to-cart input[type="checkbox"]` | Add to cart checkboxes |
| `itemRemoveCheckboxes` | `.wishlist .remove-from-wishlist input[type="checkbox"]` | Remove item checkboxes |
| `updateWishlistButton` | `#updatewishlist` | Update wishlist button |
| `addToCartButton` | `.wishlist-add-to-cart-button` | Add selected items to cart |
| `shareWishlistUrl` | `.wishlist-url-input` | Shareable wishlist URL input |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/wishlist` |
| `isWishlistEmpty()` | Returns `true` if wishlist is empty |
| `getWishlistItemCount()` | Returns number of items in wishlist |
| `getProductNames()` | Returns all product name strings |
| `updateItemQuantity(index, qty)` | Updates quantity for item at index |
| `removeItem(index)` | Removes item at index from wishlist |
| `addItemToCart(index)` | Checks one item and adds it to cart |
| `addAllItemsToCart()` | Checks all items and adds them to cart |
| `getShareableUrl()` | Returns the shareable wishlist URL |

---

### BooksPage (`pageobjects/BooksPage.ts`)

Covers the `/books` category page.

| Element | Selector | Description |
|---|---|---|
| `pageTitle` | `.page-title h1` | Page title |
| `productItems` | `.product-item` | All product cards |
| `productNames` | `.product-item .product-title a` | Product name links |
| `productPrices` | `.product-item .actual-price` | Current prices |
| `addToCartButtons` | `.product-item .product-box-add-to-cart-button` | Add to cart buttons |
| `sortByDropdown` | `#products-orderby` | Sort by dropdown |
| `pageSizeDropdown` | `#products-pagesize` | Page size dropdown |
| `priceFilterUnder25` | `getByRole('link', { name: 'Under $25.00' })` | Price filter: under $25 |
| `priceFilter25To50` | `getByRole('link', { name: '$25.00 - $50.00' })` | Price filter: $25–$50 |
| `priceFilterOver50` | `getByRole('link', { name: 'Over $50.00' })` | Price filter: over $50 |
| `nextPageButton` | `.pager .next-page` | Next page button |
| `prevPageButton` | `.pager .previous-page` | Previous page button |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/books` |
| `getProductCount()` | Returns number of products on page |
| `getProductNames()` | Returns all product name strings |
| `clickProduct(name)` | Click a product by name |
| `addProductToCartByIndex(index)` | Add product at index to cart |
| `sortBy(option)` | Sort products (position, name-asc, name-desc, price-asc, price-desc, created-on) |
| `setPageSize(size)` | Set page size (4, 8, 12) |
| `filterByPriceUnder25()` | Filter by price under $25 |
| `filterByPrice25To50()` | Filter by price $25–$50 |
| `filterByPriceOver50()` | Filter by price over $50 |
| `switchToGridView()` | Switch to grid view |
| `switchToListView()` | Switch to list view |

---

### ComputersPage (`pageobjects/ComputersPage.ts`)

Covers the `/computers` category page (subcategory hub).

| Element | Selector | Description |
|---|---|---|
| `pageTitle` | `.page-title h1` | Page title |
| `subcategoryItems` | `.sub-category-item` | All subcategory tiles |
| `desktopsLink` | `getByRole('link', { name: 'Desktops' })` | Desktops subcategory link |
| `notebooksLink` | `getByRole('link', { name: 'Notebooks' })` | Notebooks subcategory link |
| `accessoriesLink` | `getByRole('link', { name: 'Accessories' })` | Accessories subcategory link |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/computers` |
| `getSubcategoryCount()` | Returns number of subcategory tiles |
| `navigateToDesktops()` | Click Desktops subcategory |
| `navigateToNotebooks()` | Click Notebooks subcategory |
| `navigateToAccessories()` | Click Accessories subcategory |

---

### ElectronicsPage (`pageobjects/ElectronicsPage.ts`)

Covers the `/electronics` category page (subcategory hub).

| Element | Selector | Description |
|---|---|---|
| `pageTitle` | `.page-title h1` | Page title |
| `subcategoryItems` | `.sub-category-item` | All subcategory tiles |
| `cameraPhotoLink` | `getByRole('link', { name: 'Camera, photo' })` | Camera/photo subcategory link |
| `cellPhonesLink` | `getByRole('link', { name: 'Cell phones' })` | Cell phones subcategory link |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/electronics` |
| `getSubcategoryCount()` | Returns number of subcategory tiles |
| `navigateToCameraPhoto()` | Click Camera/photo subcategory |
| `navigateToCellPhones()` | Click Cell phones subcategory |

---

### ApparelPage (`pageobjects/ApparelPage.ts`)

Covers the `/apparel-shoes` category page.

| Element | Selector | Description |
|---|---|---|
| `pageTitle` | `.page-title h1` | Page title |
| `productItems` | `.product-item` | All product cards |
| `productNames` | `.product-item .product-title a` | Product name links |
| `productPrices` | `.product-item .actual-price` | Current prices |
| `addToCartButtons` | `.product-item .product-box-add-to-cart-button` | Add to cart buttons |
| `sortByDropdown` | `#products-orderby` | Sort by dropdown |
| `pageSizeDropdown` | `#products-pagesize` | Page size dropdown |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/apparel-shoes` |
| `getProductCount()` | Returns number of products on page |
| `getProductNames()` | Returns all product name strings |
| `clickProduct(name)` | Click a product by name |
| `addProductToCartByIndex(index)` | Add product at index to cart |
| `sortBy(option)` | Sort products |
| `switchToGridView()` | Switch to grid view |
| `switchToListView()` | Switch to list view |

---

### DigitalDownloadsPage (`pageobjects/DigitalDownloadsPage.ts`)

Covers the `/digital-downloads` category page.

| Element | Selector | Description |
|---|---|---|
| `pageTitle` | `.page-title h1` | Page title |
| `productItems` | `.product-item` | All product cards |
| `productNames` | `.product-item .product-title a` | Product name links |
| `productPrices` | `.product-item .actual-price` | Current prices |
| `addToCartButtons` | `.product-item .product-box-add-to-cart-button` | Add to cart buttons |
| `sortByDropdown` | `#products-orderby` | Sort by dropdown |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/digital-downloads` |
| `getProductCount()` | Returns number of products on page |
| `getProductNames()` | Returns all product name strings |
| `clickProduct(name)` | Click a product by name |
| `addProductToCartByIndex(index)` | Add product at index to cart |
| `sortBy(option)` | Sort products |

---

### JewelryPage (`pageobjects/JewelryPage.ts`)

Covers the `/jewelry` category page.

| Element | Selector | Description |
|---|---|---|
| `pageTitle` | `.page-title h1` | Page title |
| `productItems` | `.product-item` | All product cards |
| `productNames` | `.product-item .product-title a` | Product name links |
| `productPrices` | `.product-item .actual-price` | Current prices |
| `addToCartButtons` | `.product-item .product-box-add-to-cart-button` | Add to cart buttons |
| `priceFilter0To500` | `getByRole('link', { name: '0.00 - 500.00' })` | Price filter: $0–$500 |
| `priceFilter500To700` | `getByRole('link', { name: '500.00 - 700.00' })` | Price filter: $500–$700 |
| `priceFilter700To3000` | `getByRole('link', { name: '700.00 - 3000.00' })` | Price filter: $700–$3000 |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/jewelry` |
| `getProductCount()` | Returns number of products on page |
| `getProductNames()` | Returns all product name strings |
| `clickProduct(name)` | Click a product by name |
| `filterByPrice0To500()` | Filter by $0–$500 |
| `filterByPrice500To700()` | Filter by $500–$700 |
| `filterByPrice700To3000()` | Filter by $700–$3000 |

---

### GiftCardsPage (`pageobjects/GiftCardsPage.ts`)

Covers the `/gift-cards` category page.

| Element | Selector | Description |
|---|---|---|
| `pageTitle` | `.page-title h1` | Page title |
| `productItems` | `.product-item` | All product cards |
| `productNames` | `.product-item .product-title a` | Product name links |
| `productPrices` | `.product-item .actual-price` | Current prices |
| `addToCartButtons` | `.product-item .product-box-add-to-cart-button` | Add to cart buttons |
| `sortByDropdown` | `#products-orderby` | Sort by dropdown |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/gift-cards` |
| `getProductCount()` | Returns number of products on page |
| `getProductNames()` | Returns all product name strings |
| `clickProduct(name)` | Click a product by name |
| `addProductToCartByIndex(index)` | Add product at index to cart |
| `sortBy(option)` | Sort products |

---

### CameraPhotoPage (`pageobjects/CameraPhotoPage.ts`)

Covers the `/camera-photo` sub-category page (under Electronics).

| Element | Selector | Description |
|---|---|---|
| `pageTitle` | `.page-title h1` | Page title |
| `productItems` | `.product-item` | All product cards |
| `productNames` | `.product-item .product-title a` | Product name links |
| `productPrices` | `.product-item .actual-price` | Current prices |
| `addToCartButtons` | `.product-item .product-box-add-to-cart-button` | Add to cart buttons |
| `priceFilterUnder500` | `getByRole('link', { name: 'Under 500.00' })` | Price filter: under $500 |
| `priceFilterOver500` | `getByRole('link', { name: 'Over 500.00' })` | Price filter: over $500 |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/camera-photo` |
| `getProductCount()` | Returns number of products on page |
| `getProductNames()` | Returns all product name strings |
| `clickProduct(name)` | Click a product by name |
| `addProductToCartByIndex(index)` | Add product at index to cart |
| `filterByPriceUnder500()` | Filter products under $500 |
| `filterByPriceOver500()` | Filter products over $500 |

---

### CellPhonesPage (`pageobjects/CellPhonesPage.ts`)

Covers the `/cell-phones` sub-category page (under Electronics).

| Element | Selector | Description |
|---|---|---|
| `pageTitle` | `.page-title h1` | Page title |
| `productItems` | `.product-item` | All product cards |
| `productNames` | `.product-item .product-title a` | Product name links |
| `productPrices` | `.product-item .actual-price` | Current prices |
| `addToCartButtons` | `.product-item .product-box-add-to-cart-button` | Add to cart buttons |
| `sortByDropdown` | `#products-orderby` | Sort by dropdown |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/cell-phones` |
| `getProductCount()` | Returns number of products on page |
| `getProductNames()` | Returns all product name strings |
| `clickProduct(name)` | Click a product by name |
| `addProductToCartByIndex(index)` | Add product at index to cart |
| `sortBy(option)` | Sort products |

---

### SearchResultsPage (`pageobjects/SearchResultsPage.ts`)

Covers the `/search` results page after using the header search bar.

| Element | Selector | Description |
|---|---|---|
| `searchInput` | `#q` | In-page search input |
| `searchButton` | `.search-button` | In-page search submit button |
| `pageTitle` | `.page-title h1` | Page title |
| `productItems` | `.product-item` | All product result cards |
| `productNames` | `.product-item .product-title a` | Product name links |
| `productPrices` | `.product-item .actual-price` | Current prices |
| `addToCartButtons` | `.product-item .product-box-add-to-cart-button` | Add to cart buttons |
| `noResultsMessage` | `.no-result` | No results message |

| Method | Description |
|---|---|
| `goto(searchTerm?)` | Navigate to `/search` or `/search?q=term` |
| `getProductCount()` | Returns number of results |
| `getProductNames()` | Returns all result product name strings |
| `clickProduct(productName)` | Click a product by name from results |
| `addProductToCartByIndex(index)` | Add result product at index to cart |
| `addProductToCartByName(name)` | Add specific product by name to cart |
| `hasResults()` | Returns `true` if any results are displayed |

---

### ProductPage (`pageobjects/ProductPage.ts`)

Covers the individual product detail page.

| Element | Selector | Description |
|---|---|---|
| `productName` | `.product-name h1` | Product name heading |
| `productPrice` | `.product-price span` (first) | Product price |
| `productDescription` | `.full-description` | Product full description |
| `productSKU` | `.sku .value` | Product SKU code |
| `quantityInput` | `.qty-input` | Quantity input field |
| `addToCartButton` | `.add-to-cart-button` | Add to cart button |
| `addToWishlistButton` | `.add-to-wishlist-button` | Add to wishlist button |
| `barNotification` | `#bar-notification` | Notification bar (appears after adding to cart) |
| `barNotificationMessage` | `#bar-notification p` | Notification message text |
| `barNotificationClose` | `#bar-notification .close` | Close notification button |

| Method | Description |
|---|---|
| `getProductName()` | Returns product name text |
| `getProductPrice()` | Returns product price text |
| `setQuantity(quantity)` | Set quantity before adding to cart |
| `addToCart()` | Click the "Add to cart" button |
| `waitForBarNotification()` | Wait for bar notification to appear |
| `getBarNotificationText()` | Wait for and return notification text |
| `closeBarNotification()` | Close the notification bar |

---

### CheckoutPage (`pageobjects/CheckoutPage.ts`)

Covers the `/checkout/onepagecheckout` one-page checkout flow. Steps reveal progressively after each "Continue".

**Billing Address**

| Element | Selector | Description |
|---|---|---|
| `billingAddressDropdown` | `#billing-address-select` | Existing address dropdown (if available) |
| `billingFirstName` | `#BillingNewAddress_FirstName` | First name |
| `billingLastName` | `#BillingNewAddress_LastName` | Last name |
| `billingEmail` | `#BillingNewAddress_Email` | Email |
| `billingCountry` | `#BillingNewAddress_CountryId` | Country dropdown |
| `billingState` | `#BillingNewAddress_StateProvinceId` | State dropdown (loads after country) |
| `billingCity` | `#BillingNewAddress_City` | City |
| `billingAddress1` | `#BillingNewAddress_Address1` | Street address |
| `billingZip` | `#BillingNewAddress_ZipPostalCode` | Zip/postal code |
| `billingPhone` | `#BillingNewAddress_PhoneNumber` | Phone number |
| `billingContinueButton` | `#billing-buttons-container .button-1` | Billing Continue button |

**Shipping / Payment / Confirm**

| Element | Selector | Description |
|---|---|---|
| `shippingContinueButton` | `#shipping-buttons-container .button-1` | Shipping address Continue button |
| `shippingMethodOptions` | `input[name="shippingoption"]` | Shipping method radio buttons |
| `shippingMethodContinueButton` | `#shipping-method-buttons-container .button-1` | Shipping method Continue button |
| `paymentMethodOptions` | `input[name="paymentmethod"]` | Payment method radio buttons |
| `paymentMethodContinueButton` | `#payment-method-buttons-container .button-1` | Payment method Continue button |
| `paymentInfoContinueButton` | `#payment-info-buttons-container .button-1` | Payment info Continue button |
| `confirmOrderButton` | `#confirm-order-buttons-container .button-1` | Final Confirm Order button |

| Method | Description |
|---|---|
| `fillBillingAddress(details)` | Fill all billing address fields (auto-selects "New Address" if dropdown exists) |
| `continueBilling()` | Click Continue on billing step |
| `continueShipping()` | Click Continue on shipping address step |
| `selectShippingMethod(index?)` | Select shipping method by index (default: 0) |
| `continueShippingMethod()` | Click Continue on shipping method step |
| `selectPaymentMethod(methodName)` | Select payment method by name (e.g. "Check / Money Order") |
| `continuePaymentMethod()` | Click Continue on payment method step |
| `continuePaymentInfo()` | Click Continue on payment info step (if visible) |
| `confirmOrder()` | Click the final Confirm button to place order |

---

### OrderConfirmationPage (`pageobjects/OrderConfirmationPage.ts`)

Covers the order completed / Thank You page.

| Element | Selector | Description |
|---|---|---|
| `pageTitle` | `.page-title h1` | Page heading |
| `orderCompletedSection` | `.order-completed` | The order completed container |
| `successTitle` | `.order-completed .title strong` | Success message bold text |
| `orderNumberLabel` | `.order-number` | Order number element |
| `orderNumberValue` | `.order-number strong, .details-value` | Order number value |
| `continueButton` | `.order-completed-continue-button` | Continue shopping button |

| Method | Description |
|---|---|
| `isOrderSuccessful()` | Returns `true` if the order completed section is visible |
| `getSuccessMessage()` | Returns the success title text |
| `getOrderNumber()` | Returns the actual order number using a 4-strategy extraction: (1) regex on `.order-completed` text, (2) `<strong>` in `.details`, (3) dedicated CSS selectors, (4) URL ID fallback |
| `continueShopping()` | Click the Continue shopping button |

---

### PageObjectManager (`pageobjects/PageObjectManager.ts`)

Central class that instantiates all page objects. Use this in every test.

| Getter | Returns |
|---|---|
| `getHomePage()` | `HomePage` |
| `getLoginPage()` | `LoginPage` |
| `getRegisterPage()` | `RegisterPage` |
| `getCartPage()` | `CartPage` |
| `getWishlistPage()` | `WishlistPage` |
| `getBooksPage()` | `BooksPage` |
| `getComputersPage()` | `ComputersPage` |
| `getElectronicsPage()` | `ElectronicsPage` |
| `getApparelPage()` | `ApparelPage` |
| `getDigitalDownloadsPage()` | `DigitalDownloadsPage` |
| `getJewelryPage()` | `JewelryPage` |
| `getGiftCardsPage()` | `GiftCardsPage` |
| `getCameraPhotoPage()` | `CameraPhotoPage` |
| `getCellPhonesPage()` | `CellPhonesPage` |
| `getSearchResultsPage()` | `SearchResultsPage` |
| `getProductPage()` | `ProductPage` |
| `getCheckoutPage()` | `CheckoutPage` |
| `getOrderConfirmationPage()` | `OrderConfirmationPage` |

```typescript
import { PageObjectManager } from '../pageobjects/PageObjectManager';

const pom = new PageObjectManager(page);

const homePage               = pom.getHomePage();
const loginPage              = pom.getLoginPage();
const registerPage           = pom.getRegisterPage();
const cartPage               = pom.getCartPage();
const wishlistPage           = pom.getWishlistPage();
const booksPage              = pom.getBooksPage();
const computersPage          = pom.getComputersPage();
const electronicsPage        = pom.getElectronicsPage();
const apparelPage            = pom.getApparelPage();
const digitalDownloadsPage   = pom.getDigitalDownloadsPage();
const jewelryPage            = pom.getJewelryPage();
const giftCardsPage          = pom.getGiftCardsPage();
const cameraPhotoPage        = pom.getCameraPhotoPage();
const cellPhonesPage         = pom.getCellPhonesPage();
const searchResultsPage      = pom.getSearchResultsPage();
const productPage            = pom.getProductPage();
const checkoutPage           = pom.getCheckoutPage();
const orderConfirmationPage  = pom.getOrderConfirmationPage();
```

---

## Utilities

### `utils/testdata.json`

Holds static input data used across all tests. Update this file to change test inputs without touching the test code.

```json
{
  "newUser": {
    "gender": "male",
    "firstName": "John",
    "lastName": "Doe",
    "emailPrefix": "johndoe",
    "password": "Test@1234"
  },
  "search": {
    "term": "Computing and Internet",
    "expectedBook": "Computing and Internet"
  },
  "shipping": {
    "country": "United States",
    "state": "New York",
    "zip": "10001"
  },
  "checkout": {
    "firstName": "John",
    "lastName": "Doe",
    "country": "United States",
    "state": "New York",
    "city": "New York",
    "address": "123 Main Street",
    "zip": "10001",
    "phone": "1234567890"
  }
}
```

> The `emailPrefix` is combined with a `Date.now()` timestamp at runtime to generate a unique email per test run, avoiding duplicate registration errors.

---

### `utils/credentials.json`

Stores all registered user credentials as an **array**. New entries are **appended** on each registration run — old entries are never deleted. This file is automatically populated by the tests.

```json
[
  {
    "email": "johndoe+1111111111@test.com",
    "password": "Test@1234"
  },
  {
    "email": "johndoe+2222222222@test.com",
    "password": "Test@1234"
  }
]
```

> Use `CredentialManager.load()` to get the most recent credentials, or `CredentialManager.loadAll()` to get all stored entries.

---

### `utils/CredentialManager.ts`

Helper class to save and load credentials from `credentials.json`.

| Method | Description |
|---|---|
| `CredentialManager.save({ email, password })` | Appends new credentials to the array. Old entries are preserved. |
| `CredentialManager.load()` | Returns the most recently saved credentials (last entry). Throws if file is empty. |
| `CredentialManager.loadAll()` | Returns all stored credentials as an array. |

**Usage in any test:**

```typescript
import { CredentialManager } from '../utils/CredentialManager';

// Save after registration (appends, does not overwrite)
CredentialManager.save({ email: 'user@test.com', password: 'Test@1234' });

// Load most recent credentials
const credentials = CredentialManager.load();
await loginPage.login(credentials.email, credentials.password);

// Load all stored credentials
const all = CredentialManager.loadAll();
console.log(`Total registered users: ${all.length}`);
```

---

## Test Scenarios

### 1. Registration Only (`tests/registration.spec.ts`)

Registers a new user and appends credentials to `credentials.json`.

| Step | Action | Assertion |
|---|---|---|
| 1 | Navigate to `/register` | URL matches `/register` |
| 2 | Fill form with data from `testdata.json` | — |
| 3 | Submit registration form | Result contains `Your registration completed` |
| 4 | Append credentials to `credentials.json` | New entry added, old entries preserved |

**Allure:** Epic → User Account Management | Feature → Registration | Severity → Critical | Tags → Registration, Regression

---

### 2. E2E: Registration + Login (`tests/registration_login.spec.ts`)

Covers the complete new-user journey from registration through to login.

| Step | Action | Assertion |
|---|---|---|
| 1 | Navigate to `/register` and fill form | URL matches `/register` |
| 2 | Submit registration form | Result contains `Your registration completed` |
| 3 | Save credentials via `CredentialManager` | Credentials appended to file |
| 4 | Navigate to `/login` | URL matches `/login` |
| 5 | Login with saved credentials | `.account` link visible in header |
| 6 | Verify logout button | `.ico-logout` visible in header |

**Allure:** Epic → User Account Management | Feature → Registration & Login | Severity → Critical | Tags → E2E, Regression, Authentication

---

### 3. E2E: Full Purchase Flow (`tests/e2e_purchase_flow.spec.ts`)

The complete end-to-end purchase scenario — from user registration through product search, cart management, shipping estimation, checkout, and order confirmation.

| Step | Action | Assertion |
|---|---|---|
| 1 | Register a new user | Result contains `Your registration completed` |
| 2 | Save credentials & login | `.account` and `.ico-logout` visible |
| 3 | Search for `"Computing and Internet"` | Results page loads with matching product |
| 4 | Click product → Add to cart | Product detail page opens |
| 5 | Verify bar notification | Notification contains `added to your shopping cart` |
| 6 | Verify header cart count | Header shows `(1)` |
| 7 | Navigate to shopping cart | URL matches `/cart` |
| 8 | Verify book is in cart | `Computing and Internet` found in cart product names |
| 9 | Estimate shipping (US / New York / 10001) | Shipping results section becomes visible with options |
| 10 | Check Terms of Service → click Checkout | URL changes to `/checkout/` |
| 11 | Fill billing address form | All fields filled with data from `testdata.json` |
| 12 | Continue shipping address step | Step completes |
| 13 | Select first shipping method | Shipping option chosen |
| 14 | Select `Check / Money Order` payment | Payment method chosen |
| 15 | Confirm order | Order submitted |
| 16 | Verify Thank You page | `.order-completed` visible; order number captured |

**Allure Annotations:**

| Annotation | Value |
|---|---|
| Epic | E2E Purchase Flow |
| Feature | Shop & Checkout |
| Story | As a new user, I register, search for a book, add it to cart, and complete checkout |
| Severity | Critical |
| Tags | E2E, Regression, Purchase, Checkout |
| Owner | QA Team |
| Parameters | First Name, Last Name, Email, Password, Login Email, Search Term, Shipping Country, Shipping State, Shipping Zip, Billing First Name, Billing Last Name, Billing City, Billing Address, Billing Zip, Billing Phone, Order Number |
| Attachments | Test Input Data (JSON), Registration Result, Saved Credentials (JSON), Search Results, Bar Notification Text, Cart Count, Cart Products, Shipping Options, Order Number |

**Allure Step Breakdown:**

```
Step 0:  Log test input data
  └── Attach test input payload (JSON)

Step 1:  Register a new user
  ├── Navigate to the Registration page
  ├── Fill registration form and submit
  ├── Verify registration success
  └── Save credentials to credentials.json

Step 2:  Login with saved credentials
  ├── Navigate to Login page
  ├── Enter credentials and submit
  └── Verify account link and logout button

Step 3:  Search for a book
  ├── Search for "Computing and Internet" via header
  ├── Verify search results page loaded
  └── Verify expected book appears in results

Step 4:  Open the book and add it to the cart
  ├── Click product to open detail page
  └── Click "Add to cart"

Step 5:  Verify "added to cart" notification bar
  └── Wait for and read bar notification text

Step 6:  Verify shopping cart count in the header
  └── Read cart count (expects "(1)")

Step 7:  Navigate to the shopping cart
  └── Click cart link → URL matches /cart

Step 8:  Verify the correct book is in the cart
  └── Read product names from cart table

Step 9:  Estimate shipping cost
  ├── Fill shipping estimation form and submit (country, state, zip)
  └── Verify shipping options are displayed

Step 10: Accept terms of service and proceed to checkout
  ├── Check the Terms of Service checkbox
  └── Click the Checkout button

Step 11: Fill in billing address details
  ├── Enter all billing address fields
  └── Click Continue

Step 12: Confirm shipping address (same as billing)
  └── Click Continue

Step 13: Select shipping method
  ├── Select first available method
  └── Click Continue

Step 14: Select payment method
  ├── Select "Check / Money Order"
  ├── Click Continue
  └── Continue payment info step (if visible)

Step 15: Confirm the order
  └── Click Confirm button

Step 16: Verify order confirmation page
  ├── Verify URL matches /completed
  ├── Verify order completed section is visible
  └── Capture and assert order number
```

---

## Comprehensive Test Scenario Coverage

Full scenario list covering all functional areas of the application. **149 total scenarios** across 13 modules.

> **Status Legend:** `Implemented` — automated test exists. `Planned` — identified but not yet automated.

---

### Scenario Summary

| Module | Total | Implemented | Planned | Spec File |
|--------|-------|-------------|---------|-----------|
| 1. Registration | 8 | 8 | 0 | `user_registration.spec.ts` |
| 2. Authentication (Login/Logout) | 8 | 8 | 0 | `user_authentication.spec.ts` |
| 3. Home Page | 9 | 9 | 0 | `home_page.spec.ts` |
| 4. Product Search | 12 | 12 | 0 | `product_search.spec.ts` |
| 5A. Books | 8 | 8 | 0 | `category_books.spec.ts` |
| 5B. Computers | 7 | 7 | 0 | `category_computers.spec.ts` |
| 5C. Electronics | 5 | 5 | 0 | `category_electronics.spec.ts` |
| 5D. Apparel & Shoes | 5 | 5 | 0 | `category_apparel.spec.ts` |
| 5E. Digital Downloads | 3 | 3 | 0 | `category_digital_downloads.spec.ts` |
| 5F. Jewelry | 4 | 4 | 0 | `category_jewelry.spec.ts` |
| 5G. Gift Cards | 4 | 4 | 0 | `category_gift_cards.spec.ts` |
| 6. Product Detail Page | 12 | 12 | 0 | `product_detail_page.spec.ts` |
| 7. Shopping Cart | 13 | 13 | 0 | `shopping_cart.spec.ts` |
| 8. Checkout Flow | 13 | 13 | 0 | `checkout_flow.spec.ts` |
| 9. My Account | 12 | 12 | 0 | `my_account.spec.ts` |
| 10. Wishlist | 7 | 7 | 0 | `wishlist.spec.ts` |
| 11. Product Comparison | 4 | 0 | 4 | Planned |
| 12. Content / Static Pages | 10 | 0 | 10 | Planned |
| 13. End-to-End Flows | 10 | 1 | 9 | `e2e_purchase_flow.spec.ts` + Planned |
| **Total** | **149** | **145** | **4** | — |

---

### Module 1 — User Registration
**Spec file:** `tests/user_registration.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 1.1 | Register with valid data (male gender) | High | Implemented |
| 1.2 | Register with valid data (female gender) | High | Implemented |
| 1.3 | Register with duplicate email → error message | High | Implemented |
| 1.4 | Register with blank required fields → validation errors | High | Implemented |
| 1.5 | Register with invalid email format → validation error | High | Implemented |
| 1.6 | Register with mismatched passwords → validation error | High | Implemented |
| 1.7 | Register with weak/short password → validation error | Medium | Implemented |
| 1.8 | Verify auto-login or redirect after successful registration | Medium | Implemented |

---

### Module 2 — User Authentication (Login / Logout)
**Spec file:** `tests/user_authentication.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 2.1 | Login with valid credentials | High | Implemented |
| 2.2 | Login with invalid password → error message | High | Implemented |
| 2.3 | Login with unregistered email → error message | High | Implemented |
| 2.4 | Login with blank fields → validation errors | High | Implemented |
| 2.5 | "Remember me" checkbox persists session after browser reopen | Medium | Implemented |
| 2.6 | Forgot password → receive recovery email confirmation message | Medium | Implemented |
| 2.7 | Logout successfully → redirected, session cleared | High | Implemented |
| 2.8 | Access protected page (`/customer/info`) without login → redirect to login | High | Implemented |

---

### Module 3 — Home Page
**Spec file:** `tests/home_page.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 3.1 | Verify 6 featured products are displayed | Medium | Implemented |
| 3.2 | Verify all main category navigation links are visible | Medium | Implemented |
| 3.3 | Verify subcategory flyout menus (Computers: Desktops / Notebooks / Accessories) | Medium | Implemented |
| 3.4 | Verify popular tags cloud is displayed | Low | Implemented |
| 3.5 | Newsletter signup with valid email → success message | Medium | Implemented |
| 3.6 | Newsletter signup with invalid email → error | Low | Implemented |
| 3.7 | Community poll: submit a vote and verify updated result | Low | Implemented |
| 3.8 | Flyout cart on header hover shows cart items and subtotal | Low | Implemented |
| 3.9 | Click featured product → navigates to correct product detail page | Medium | Implemented |

---

### Module 4 — Product Search
**Spec file:** `tests/product_search.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 4.1 | Search with valid keyword returns matching results | High | Implemented |
| 4.2 | Search with empty keyword → validation message | High | Implemented |
| 4.3 | Search with keyword yielding no results → "No products were found" | High | Implemented |
| 4.4 | Search autocomplete suggestions appear on input | Medium | Implemented |
| 4.5 | Advanced search: filter results by category dropdown | Medium | Implemented |
| 4.6 | Advanced search: filter results by price range (From / To) | Medium | Implemented |
| 4.7 | Advanced search: "Automatically search sub categories" checkbox | Medium | Implemented |
| 4.8 | Advanced search: filter by manufacturer (Tricentis) | Low | Implemented |
| 4.9 | Advanced search: "Search in product descriptions" checkbox | Low | Implemented |
| 4.10 | Search results: sort by Name A-Z / Z-A / Price Low-High / Price High-Low | Medium | Implemented |
| 4.11 | Search results: change items per page (4 / 8 / 12) | Low | Implemented |
| 4.12 | Search results: switch between Grid and List view | Low | Implemented |

---

### Module 5 — Category Pages

Each sub-module has its own dedicated spec file under `tests/`.

#### 5A. Books (`/books`)
**Spec file:** `tests/category_books.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 5A.1 | All 6 books are listed with correct names and prices | Medium | Implemented |
| 5A.2 | Filter by price range: Under $25.00 | Medium | Implemented |
| 5A.3 | Filter by price range: $25.00 – $50.00 | Medium | Implemented |
| 5A.4 | Filter by price range: Over $50.00 | Medium | Implemented |
| 5A.5 | Sort products by Name A-Z, Z-A, Price Low-High, Price High-Low | Medium | Implemented |
| 5A.6 | Switch items per page (4 / 8 / 12) | Low | Implemented |
| 5A.7 | Switch between Grid and List view | Low | Implemented |
| 5A.8 | Click product → navigate to product detail page | High | Implemented |

#### 5B. Computers (`/computers`)
**Spec file:** `tests/category_computers.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 5B.1 | Three subcategory tiles (Desktops, Notebooks, Accessories) are shown | Medium | Implemented |
| 5B.2 | Click Desktops → navigate to `/desktops` | High | Implemented |
| 5B.3 | Click Notebooks → navigate to `/notebooks` | High | Implemented |
| 5B.4 | Click Accessories → navigate to `/accessories` | High | Implemented |
| 5B.5 | Desktops: configure and add a custom computer to cart | High | Implemented |
| 5B.6 | Notebooks: sort and add a notebook to cart | Medium | Implemented |
| 5B.7 | Accessories: filter and add an accessory to cart | Medium | Implemented |

#### 5C. Electronics (`/electronics`)
**Spec file:** `tests/category_electronics.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 5C.1 | Two subcategory tiles (Camera/Photo, Cell Phones) are shown | Medium | Implemented |
| 5C.2 | Click Camera/Photo → navigate to `/camera-photo` | High | Implemented |
| 5C.3 | Click Cell Phones → navigate to `/cell-phones` | High | Implemented |
| 5C.4 | Add a camera product to cart | Medium | Implemented |
| 5C.5 | Add a cell phone to cart | Medium | Implemented |

#### 5D. Apparel & Shoes (`/apparel-shoes`)
**Spec file:** `tests/category_apparel.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 5D.1 | Products listed with correct names and prices | Medium | Implemented |
| 5D.2 | Pagination works (Page 1 → Page 2) | Medium | Implemented |
| 5D.3 | Sort by price low-to-high | Medium | Implemented |
| 5D.4 | Add an apparel item to cart | Medium | Implemented |
| 5D.5 | Add item requiring size/color attribute selection to cart | Medium | Implemented |

#### 5E. Digital Downloads (`/digital-downloads`)
**Spec file:** `tests/category_digital_downloads.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 5E.1 | All 3 digital products listed with correct prices | Medium | Implemented |
| 5E.2 | Add a digital download to cart | Medium | Implemented |
| 5E.3 | Digital download product page shows download info | Low | Implemented |

#### 5F. Jewelry (`/jewelry`)
**Spec file:** `tests/category_jewelry.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 5F.1 | All 5 jewelry items listed with correct prices | Medium | Implemented |
| 5F.2 | Filter by price range ($0–$500 / $500–$700 / $700–$3000) | Medium | Implemented |
| 5F.3 | "Create Your Own Jewelry" with custom attributes | Medium | Implemented |
| 5F.4 | Add a standard jewelry item to cart | Medium | Implemented |

#### 5G. Gift Cards (`/gift-cards`)
**Spec file:** `tests/category_gift_cards.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 5G.1 | All 4 gift card products listed with correct prices | Medium | Implemented |
| 5G.2 | Add virtual gift card ($5 / $25) with recipient details | High | Implemented |
| 5G.3 | Add physical gift card ($50 / $100) to cart | Medium | Implemented |
| 5G.4 | Verify gift card form fields: sender name, recipient name, email, message | High | Implemented |

---

### Module 6 — Product Detail Page
**Spec file:** `tests/product_detail_page.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 6.1 | Product name, price, and description are displayed correctly | High | Implemented |
| 6.2 | Add to cart with default quantity (1) | High | Implemented |
| 6.3 | Add to cart with quantity greater than 1 | High | Implemented |
| 6.4 | "Added to your shopping cart" bar notification appears | High | Implemented |
| 6.5 | Add product to wishlist from product detail page | High | Implemented |
| 6.6 | Configurable product page renders all attribute options (Build your own computer) | High | Implemented |
| 6.7 | Configure computer: choose processor, RAM, HDD, OS, software | High | Implemented |
| 6.8 | Product price updates dynamically based on selected configuration | Medium | Implemented |
| 6.9 | Add product to compare list from product listing | Low | Implemented |
| 6.10 | Submit a product review when logged in | Medium | Implemented |
| 6.11 | "Email a friend" link navigates to email form | Low | Implemented |
| 6.12 | Social media share links are visible on product page | Low | Implemented |

---

### Module 7 — Shopping Cart
**Spec file:** `tests/shopping_cart.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 7.1 | Cart displays correct product name, unit price, quantity, and subtotal | High | Implemented |
| 7.2 | Update product quantity in cart → subtotal recalculates correctly | High | Implemented |
| 7.3 | Remove item from cart → cart becomes empty | High | Implemented |
| 7.4 | Cart item count badge in header updates correctly after add/remove | High | Implemented |
| 7.5 | Estimate shipping: select country/state, enter zip → rates displayed | High | Implemented |
| 7.6 | Apply valid coupon code → discount applied to order total | Medium | Implemented |
| 7.7 | Apply invalid coupon code → error message displayed | Medium | Implemented |
| 7.8 | Apply gift card code → balance deducted from order total | Medium | Implemented |
| 7.9 | Terms of Service checkbox must be accepted before checkout | High | Implemented |
| 7.10 | Proceeding to checkout without accepting ToS → blocked with error | High | Implemented |
| 7.11 | Header flyout cart shows added items and subtotal on hover | Medium | Implemented |
| 7.12 | "Continue shopping" from cart → returns to previous page | Low | Implemented |
| 7.13 | Cart contents persist after browser refresh for a logged-in user | Medium | Implemented |

---

### Module 8 — Checkout Flow
**Spec file:** `tests/checkout_flow.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 8.1 | Complete checkout as a guest (no account required) | High | Implemented |
| 8.2 | Complete checkout as a registered / logged-in user | High | Implemented |
| 8.3 | Billing address: fill all required fields and continue | High | Implemented |
| 8.4 | Billing address: leave required fields blank → validation errors shown | High | Implemented |
| 8.5 | Use an existing saved address for billing | Medium | Implemented |
| 8.6 | Toggle "Ship to different address" and fill separate shipping address | Medium | Implemented |
| 8.7 | Select Ground shipping method and continue | High | Implemented |
| 8.8 | Select Next Day Air shipping method and verify updated cost | Medium | Implemented |
| 8.9 | Select "Check / Money Order" payment method and confirm | High | Implemented |
| 8.10 | Select Credit Card payment method (if available) and confirm | Medium | Implemented |
| 8.11 | Order confirmation page displays a valid order number | High | Implemented |
| 8.12 | Order confirmation page displays correct items and order total | High | Implemented |
| 8.13 | "Thank you" / order completed page is displayed after order submission | High | Implemented |

---

### Module 9 — My Account (Authenticated)
**Spec file:** `tests/my_account.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 9.1 | View and edit customer info (name, email, gender, date of birth) | High | Implemented |
| 9.2 | Change password with valid old and new password | High | Implemented |
| 9.3 | Change password with wrong old password → error message | High | Implemented |
| 9.4 | View order history list in My Account | High | Implemented |
| 9.5 | View individual order details (products, total, status) | High | Implemented |
| 9.6 | Add a new shipping address | Medium | Implemented |
| 9.7 | Edit an existing shipping address | Medium | Implemented |
| 9.8 | Delete a shipping address | Medium | Implemented |
| 9.9 | View downloadable products section (for digital download purchases) | Medium | Implemented |
| 9.10 | View back-in-stock subscriptions | Low | Implemented |
| 9.11 | View reward points balance | Low | Implemented |
| 9.12 | Manage newsletter subscription preference (subscribe / unsubscribe) | Low | Implemented |

---

### Module 10 — Wishlist
**Spec file:** `tests/wishlist.spec.ts`

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 10.1 | Add a product to wishlist when logged in | High | Implemented |
| 10.2 | View wishlist → product appears with correct name and price | High | Implemented |
| 10.3 | Move a wishlist item to shopping cart | High | Implemented |
| 10.4 | Remove an item from the wishlist | High | Implemented |
| 10.5 | Attempt to add to wishlist when not logged in → redirect to login | High | Implemented |
| 10.6 | Share wishlist via public shareable link | Low | Implemented |
| 10.7 | Update quantity of a wishlist item | Low | Implemented |

---

### Module 11 — Product Comparison

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 11.1 | Add 2 products to the compare list | Medium | Planned |
| 11.2 | View comparison table → products displayed side by side | Medium | Planned |
| 11.3 | Remove a product from the comparison table | Low | Planned |
| 11.4 | Clear the entire comparison list | Low | Planned |

---

### Module 12 — Content / Static Pages

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 12.1 | About Us page loads successfully (`/aboutus`) | Low | Planned |
| 12.2 | Contact Us page: submit form with valid data → success message | Medium | Planned |
| 12.3 | Contact Us page: submit with blank required fields → validation errors | Medium | Planned |
| 12.4 | Sitemap page loads with all category links visible | Low | Planned |
| 12.5 | Privacy Notice page loads correctly | Low | Planned |
| 12.6 | Conditions of Use page loads correctly | Low | Planned |
| 12.7 | Shipping & Returns page loads correctly | Low | Planned |
| 12.8 | News Blog page loads and lists articles | Low | Planned |
| 12.9 | New Products page loads and shows recently added items | Low | Planned |
| 12.10 | Recently Viewed Products page shows previously browsed items | Low | Planned |

---

### Module 13 — End-to-End Cross-Module Flows

| ID | Scenario | Priority | Status |
|----|----------|----------|--------|
| 13.1 | Register → Login → Search → Add to Cart → Checkout → Order Confirmation | High | Implemented |
| 13.2 | Login → Browse category → Apply filter/sort → Add to Cart → Checkout | High | Planned |
| 13.3 | Login → Add product to Wishlist → Move to Cart → Checkout | High | Planned |
| 13.4 | Guest checkout: no account → complete full purchase | High | Planned |
| 13.5 | Login → Configure custom computer → Add to cart → Checkout | High | Planned |
| 13.6 | Login → Add gift card with recipient info → Checkout | Medium | Planned |
| 13.7 | Login → Add multiple different products → Checkout with combined order | Medium | Planned |
| 13.8 | Login → Apply coupon code → Checkout with discount applied | Medium | Planned |
| 13.9 | Login → Estimate shipping in cart → Verify total includes shipping cost | Medium | Planned |
| 13.10 | Register → Complete purchase → View order in My Account order history | High | Planned |

---

## Allure Report Basics Test Suite

A dedicated learning and reference suite located in `tests/allure-report-basics/` that demonstrates every major Allure annotation API with real, runnable Playwright tests.

### Scripts

| File | Allure Feature Demonstrated |
|------|----------------------------|
| `01_basic_description_severity.spec.ts` | `allure.descriptionHtml()`, `allure.severity()` |
| `02_allure_steps.spec.ts` | `allure.step()` nesting, `test.step()` combination |
| `03_screenshots_attachment.spec.ts` | `allure.attachment()` with screenshots (PNG) |
| `04_epic_feature_story.spec.ts` | `allure.epic()`, `allure.feature()`, `allure.story()` — Behaviors tab |
| `05_allure_parameters.spec.ts` | `allure.parameter()` — Parameters tab |
| `06_allure_attachments.spec.ts` | `allure.attachment()` — text, JSON, HTML content types |
| `07_allure_with_hooks.spec.ts` | `test.beforeEach` / `test.afterEach` hooks with Allure metadata |
| `08_allure_links.spec.ts` | `allure.link()`, `allure.issue()`, `allure.tms()` |
| `09_complete_example.spec.ts` | All features combined — full annotated real-world example |

### Run the entire suite

```bash
npx playwright test tests/allure-report-basics/
```

### Run a single script

```bash
npx playwright test tests/allure-report-basics/01_basic_description_severity.spec.ts
```

### Run and view in Allure

```bash
npx playwright test tests/allure-report-basics/ --reporter=line,allure-playwright
npx allure generate allure-results --clean && npx allure open
```

---

## NPM Scripts

| Script | Command | Description |
|---|---|---|
| `npm test` | `playwright test` | Run all tests (headless) |
| `npm run test:headed` | `playwright test --headed` | Run tests with visible browser |
| `npm run test:ui` | `playwright test --ui` | Open Playwright interactive UI mode |
| `npm run test:debug` | `playwright test --debug` | Run tests in debug/step mode |
| `npm run allure:generate` | `allure generate allure-results --clean` | Generate Allure report from results |
| `npm run allure:open` | `allure open` | Open the last generated Allure report |
| `npm run allure:serve` | `allure serve allure-results` | Generate and instantly serve Allure report |
| `npm run report:html` | `playwright show-report` | Open the Playwright HTML report |
| `npm run test:allure` | `playwright test && allure generate ... && allure open` | Run all tests then open Allure report |

---

## Running Tests

### Run all tests and open Allure report (recommended)
```bash
npm run test:allure
```

### Run all tests only
```bash
npm test
```

### Run a specific test file
```bash
# Original E2E flows
npx playwright test tests/registration.spec.ts
npx playwright test tests/registration_login.spec.ts
npx playwright test tests/e2e_purchase_flow.spec.ts

# Module 1 — User Registration
npx playwright test tests/user_registration.spec.ts

# Module 2 — User Authentication (Login / Logout)
npx playwright test tests/user_authentication.spec.ts

# Module 3 — Home Page
npx playwright test tests/home_page.spec.ts

# Module 4 — Product Search
npx playwright test tests/product_search.spec.ts

# Module 6 — Product Detail Page
npx playwright test tests/product_detail_page.spec.ts

# Module 7 — Shopping Cart
npx playwright test tests/shopping_cart.spec.ts

# Module 8 — Checkout Flow
npx playwright test tests/checkout_flow.spec.ts

# Module 9 — My Account
npx playwright test tests/my_account.spec.ts

# Module 10 — Wishlist
npx playwright test tests/wishlist.spec.ts

# Module 5 — Category Pages (run all or individually)
npx playwright test tests/category_books.spec.ts
npx playwright test tests/category_computers.spec.ts
npx playwright test tests/category_electronics.spec.ts
npx playwright test tests/category_apparel.spec.ts
npx playwright test tests/category_digital_downloads.spec.ts
npx playwright test tests/category_jewelry.spec.ts
npx playwright test tests/category_gift_cards.spec.ts

# Run all category specs together
npx playwright test --grep "Module 5"

# Allure Report Basics suite
npx playwright test tests/allure-report-basics/
```

### Run tests by module tag
```bash
# Run by Allure tag (requires test:allure)
npx playwright test --grep "Registration"
npx playwright test --grep "Login"
npx playwright test --grep "Search"
npx playwright test --grep "Books"
```

### Run in headed mode (visible browser — great for demos)
```bash
npm run test:headed
```

### Run a specific test in headed mode
```bash
npx playwright test tests/e2e_purchase_flow.spec.ts --headed
```

### Run in interactive UI mode
```bash
npm run test:ui
```

### Run in debug mode
```bash
npm run test:debug
```

---

## Reports

### Allure Report

The Allure report provides rich, visual test results with step-by-step breakdowns, screenshots, and metadata.

**Generate and open:**
```bash
npm run allure:generate
npm run allure:open
```

**Or serve instantly:**
```bash
npm run allure:serve
```

> Allure raw results are saved to `allure-results/` after each test run.

### Playwright HTML Report

```bash
npm run report:html
```

---

## Allure Report Details

When you open the Allure report, here is what you will see:

### Overview Panel
- **Epic / Feature / Story** hierarchy for navigation and filtering in the Behaviors tab
- **Severity** badge (Critical, Major, Normal, Minor)
- **Tags** (E2E, Regression, Purchase, Checkout, etc.)
- **Owner** of the test
- **Clickable link** to the application under test
- **Environment** widget — shows Browser, Base URL, Environment, Platform, Test Framework, Language (populated by `global-setup.ts` writing `environment.properties` before each run)

### Test Description
Each test has a full HTML description with:
- **Test Objective** — what the test verifies
- **Pre-conditions** — what must be true before the test runs
- **Numbered test steps** — all actions listed
- **Expected Result** — what success looks like

### Step Breakdown
Steps are nested (`test.step` → `allure.step`) for full visibility of every action. The E2E purchase flow has 17 top-level steps (Step 0 through Step 16), each expanded with Playwright-level sub-steps.

### Parameters
All parameters appear in a flat table at the test level. They are prefixed by context to avoid ambiguity:

| Parameter | Example Value | Context |
|---|---|---|
| First Name | John | Registration |
| Last Name | Doe | Registration |
| Email | johndoe+...@test.com | Registration |
| Password | \*\*\*hidden\*\*\* | Registration |
| Login Email | johndoe+...@test.com | Login step |
| Search Term | Computing and Internet | Search step |
| Shipping Country | United States | Shipping estimation |
| Shipping State | New York | Shipping estimation |
| Shipping Zip | 10001 | Shipping estimation |
| Billing First Name | John | Billing address |
| Billing Last Name | Doe | Billing address |
| Billing City | New York | Billing address |
| Billing Address | 123 Main Street | Billing address |
| Billing Zip | 10001 | Billing address |
| Billing Phone | 1234567890 | Billing address |
| Order Number | 2239909 | Order confirmation |

### Attachments
The following files are captured per test run:

| Attachment | Type | Contents |
|---|---|---|
| Test Input Data | JSON | All input values used (Step 0) |
| Registration Result | Text | Actual UI success message |
| Saved Credentials | JSON | Registered email (password hidden) |
| Search Results | Text | All product names found |
| Bar Notification Text | Text | Add-to-cart notification |
| Cart Count Text | Text | Header cart count |
| Cart Products | Text | Items in cart |
| Shipping Options | Text | Available shipping methods and costs |
| Order Number | Text | The actual confirmed order number |
| Screenshot | PNG | Final page state |
| Video | WebM | Full test recording |
| Trace | ZIP | Playwright trace for debugging |

---

## .gitignore

| Folder | Reason |
|---|---|
| `node_modules/` | Third-party dependencies — restored via `npm install` |
| `test-results/` | Playwright test artifacts (screenshots, videos, traces) |
| `playwright-report/` | Playwright HTML report output |
| `allure-results/` | Raw Allure test result files generated per run |
| `allure-report/` | Generated Allure HTML report |

> Never commit `allure-results/` or `allure-report/` — these are generated locally using `npm run allure:generate`.

---

## How to Add a New Test

1. **Create a page object** (if needed) in `pageobjects/` following the pattern of existing pages.
2. **Register it** in `PageObjectManager.ts` with a private field and getter method.
3. **Add test data** to `utils/testdata.json` if the test needs static input.
4. **Create a spec file** in `tests/` with the `*.spec.ts` naming convention.
5. **Use `PageObjectManager`** to access page objects — never instantiate them directly.
6. **Add Allure annotations** so the report is descriptive and searchable.

```typescript
import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, owner, tag, descriptionHtml, step } from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';
import testData from '../utils/testdata.json';

test('My new test scenario', async ({ page }) => {
  await epic('My Epic');
  await feature('My Feature');
  await story('My Story');
  await severity(Severity.NORMAL);
  await tag('Regression');
  await owner('QA Team');

  const pom = new PageObjectManager(page);
  const homePage = pom.getHomePage();

  await test.step('Step 1: Navigate to home page', async () => {
    await step('Go to home page', async () => {
      await homePage.goto();
      await expect(page).toHaveURL('/');
    });
  });
});
```
