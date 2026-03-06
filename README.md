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
│   ├── example.spec.ts                 # Default Playwright sample test
│   ├── registration.spec.ts            # Registration only — saves credentials
│   ├── registration_login.spec.ts      # E2E: Registration + Login scenario
│   └── e2e_purchase_flow.spec.ts       # E2E: Full purchase flow (16 steps)
│
├── utils/                              # Utilities and test data
│   ├── testdata.json                   # Static input data for tests
│   ├── credentials.json                # Runtime-saved user credentials (array, appended)
│   └── CredentialManager.ts            # Helper to save/load/loadAll credentials
│
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
| Headless | `true` |
| Test timeout | 30 seconds |
| Expect timeout | 5 seconds |
| Retries | 0 |
| Screenshots | On (all tests) |
| Video | On (all tests) |
| Trace | On (all tests) |
| Reporters | HTML, Line, Allure |

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
| `getOrderNumber()` | Returns the order number (tries element, then URL extraction as fallback) |
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
| Parameters | Search Term, Country, State, Zip, First Name, Last Name, City, Address, Phone, Order Number |
| Attachments | Test Input Data, Search Results, Bar Notification Text, Cart Count, Cart Products, Shipping Options, Order Number |

**Allure Step Breakdown:**

```
Step 1:  Register a new user
  ├── Navigate to the Registration page
  ├── Fill in registration details
  ├── Submit form and verify success message
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
  ├── Select country, state and enter zip code
  ├── Click "Estimate shipping"
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
npx playwright test tests/registration.spec.ts
npx playwright test tests/registration_login.spec.ts
npx playwright test tests/e2e_purchase_flow.spec.ts
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
- **Epic / Feature / Story** hierarchy for navigation and filtering
- **Severity** badge (Critical, Major, Normal, Minor)
- **Tags** (E2E, Regression, Purchase, Authentication, etc.)
- **Owner** of the test
- **Clickable link** to the application under test

### Test Description
Each test has a full HTML description with:
- **Test Objective** — what the test verifies
- **Pre-conditions** — what must be true before the test runs
- **Numbered test steps** — all actions listed
- **Expected Result** — what success looks like

### Step Breakdown
Steps are nested (test.step → allure step) for full visibility of every action.

### Parameters
Each step logs its inputs as a parameter table:

| Parameter | Example Value |
|---|---|
| Search Term | Computing and Internet |
| Country | United States |
| State | New York |
| Zip Code | 10001 |
| First Name | John |
| Order Number | 12345 |

### Attachments
The following files are captured per test run:

| Attachment | Type | Contents |
|---|---|---|
| Test Input Data | JSON | All input values used |
| Registration Result | Text | Actual UI success message |
| Search Results | Text | All product names found |
| Bar Notification Text | Text | Add-to-cart notification |
| Cart Count Text | Text | Header cart count |
| Cart Products | Text | Items in cart |
| Shipping Options | Text | Available shipping methods |
| Order Number | Text | The confirmed order ID |

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
