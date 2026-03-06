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
├── pageobjects/                    # Page Object classes
│   ├── HomePage.ts                 # Home page — header, nav, search, newsletter
│   ├── LoginPage.ts                # Login page — form, validation errors
│   ├── RegisterPage.ts             # Register page — form, validation errors
│   ├── CartPage.ts                 # Shopping cart — items, totals, coupon, checkout
│   ├── WishlistPage.ts             # Wishlist — items, add to cart, share URL
│   ├── BooksPage.ts                # Books category — products, filters, sort, pagination
│   ├── ComputersPage.ts            # Computers category — subcategory tiles
│   ├── ElectronicsPage.ts          # Electronics category — subcategory tiles
│   └── PageObjectManager.ts        # Central manager for all page objects
│
├── tests/                          # Test spec files
│   ├── example.spec.ts             # Default Playwright sample test
│   ├── registration.spec.ts        # Registration only — saves credentials
│   └── registration_login.spec.ts  # E2E: Registration + Login scenario
│
├── utils/                          # Utilities and test data
│   ├── testdata.json               # Static input data for tests
│   ├── credentials.json            # Runtime-saved user credentials (array, appended)
│   └── CredentialManager.ts        # Helper to save/load/loadAll credentials
│
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript compiler configuration
├── package.json                    # Dependencies and npm scripts
├── CLAUDE.md                       # Claude Code project instructions
└── README.md                       # Project documentation
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
| `cartLink` | `.cart-qty` | Shopping cart indicator |
| `wishlistLink` | `.wishlist-qty` | Wishlist indicator |
| `searchInput` | `#small-searchterms` | Search bar input |
| `searchButton` | `.search-box button[type="submit"]` | Search submit button |
| `booksMenu` | `getByRole('link', { name: 'Books' })` | Books nav link |
| `computersMenu` | `getByRole('link', { name: 'Computers' })` | Computers nav link |
| `electronicsMenu` | `getByRole('link', { name: 'Electronics' })` | Electronics nav link |
| `apparelMenu` | `getByRole('link', { name: 'Apparel & Shoes' })` | Apparel nav link |
| `digitalDownloadsMenu` | `getByRole('link', { name: 'Digital downloads' })` | Digital downloads nav link |
| `jewelryMenu` | `getByRole('link', { name: 'Jewelry' })` | Jewelry nav link |
| `giftCardsMenu` | `getByRole('link', { name: 'Gift Cards' })` | Gift Cards nav link |
| `newsletterEmailInput` | `#newsletter-email` | Newsletter email input |
| `newsletterSubscribeButton` | `#newsletter-subscribe-button` | Newsletter subscribe button |

| Method | Description |
|---|---|
| `goto()` | Navigate to home page |
| `search(term)` | Fill search input and submit |
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
| `registerLink` | `getByRole('link', { name: 'Register' })` | Register link |
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
| `firstNameError` | `#FirstName-error` | First name validation error |
| `lastNameError` | `#LastName-error` | Last name validation error |
| `emailError` | `#Email-error` | Email validation error |
| `passwordError` | `#Password-error` | Password validation error |
| `confirmPasswordError` | `#ConfirmPassword-error` | Confirm password validation error |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/register` |
| `register(gender, firstName, lastName, email, password)` | Fill and submit registration form |
| `getRegistrationResult()` | Returns the registration result message text |

---

### CartPage (`pageobjects/CartPage.ts`)

Covers the `/cart` page.

| Element | Selector | Description |
|---|---|---|
| `cartTable` | `.cart` | Cart items table |
| `cartItems` | `.cart tbody tr` | All cart item rows |
| `emptyCartMessage` | `.no-data` | Empty cart message |
| `itemProductNames` | `.cart .product-name a` | Product name links |
| `itemUnitPrices` | `.cart .unit-price .product-unit-price` | Unit price per item |
| `itemQuantityInputs` | `.cart .qty-input` | Quantity inputs |
| `itemSubtotals` | `.cart .subtotal .product-subtotal` | Subtotal per item |
| `itemRemoveCheckboxes` | `.cart .remove-from-cart input[type="checkbox"]` | Remove item checkboxes |
| `updateCartButton` | `#updatecart` | Update cart button |
| `continueShoppingButton` | `.continue-shopping-button` | Continue shopping link |
| `checkoutButton` | `#checkout` | Proceed to checkout button |
| `couponCodeInput` | `#couponcode` | Coupon code input |
| `applyCouponButton` | `#applycouponbutton` | Apply coupon button |
| `couponMessage` | `.coupon-code-result` | Coupon result message |
| `giftCardInput` | `#giftcardcouponcode` | Gift card input |
| `applyGiftCardButton` | `#applygiftcardcouponcode` | Apply gift card button |
| `subTotal` | `.order-subtotal td:last-child` | Order subtotal |
| `shipping` | `.shipping-cost td:last-child` | Shipping cost |
| `tax` | `.tax-value td:last-child` | Tax amount |
| `orderTotal` | `.order-total td:last-child` | Order total |
| `termsOfServiceCheckbox` | `#termsofservice` | Terms of service checkbox |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/cart` |
| `isCartEmpty()` | Returns `true` if cart is empty |
| `getCartItemCount()` | Returns number of items in cart |
| `getProductNames()` | Returns all product name strings |
| `getOrderTotal()` | Returns order total text |
| `updateItemQuantity(index, qty)` | Updates quantity for item at index |
| `removeItem(index)` | Removes item at index from cart |
| `applyCoupon(code)` | Applies a coupon code |
| `applyGiftCard(code)` | Applies a gift card code |
| `proceedToCheckout()` | Accepts terms and clicks checkout |

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
| `itemSubtotals` | `.wishlist .subtotal .product-subtotal` | Subtotal per item |
| `itemAddToCartCheckboxes` | `.wishlist .add-to-cart input[type="checkbox"]` | Add to cart checkboxes |
| `itemRemoveCheckboxes` | `.wishlist .remove-from-wishlist input[type="checkbox"]` | Remove item checkboxes |
| `updateWishlistButton` | `#updatewishlist` | Update wishlist button |
| `addToCartButton` | `.wishlist-add-to-cart-button` | Add selected items to cart |
| `continueShoppingButton` | `.continue-shopping-button` | Continue shopping link |
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
| `productOldPrices` | `.product-item .old-price` | Original (struck-through) prices |
| `addToCartButtons` | `.product-item .product-box-add-to-cart-button` | Add to cart buttons |
| `addToWishlistButtons` | `.product-item .add-to-wishlist-button` | Add to wishlist buttons |
| `addToCompareButtons` | `.product-item .add-to-compare-list-button` | Add to compare buttons |
| `gridViewButton` | `.viewmode-icon.grid` | Grid view toggle |
| `listViewButton` | `.viewmode-icon.list` | List view toggle |
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
| `getProductPrices()` | Returns all product price strings |
| `clickProduct(name)` | Click a product by name |
| `addProductToCartByIndex(index)` | Add product at index to cart |
| `addProductToWishlistByIndex(index)` | Add product at index to wishlist |
| `sortBy(option)` | Sort products (`position`, `name-asc`, `name-desc`, `price-asc`, `price-desc`, `created-on`) |
| `setPageSize(size)` | Set page size (`4`, `8`, `12`) |
| `filterByPriceUnder25()` | Filter by price under $25 |
| `filterByPrice25To50()` | Filter by price $25–$50 |
| `filterByPriceOver50()` | Filter by price over $50 |
| `switchToGridView()` | Switch to grid view |
| `switchToListView()` | Switch to list view |

---

### ComputersPage (`pageobjects/ComputersPage.ts`)

Covers the `/computers` category page.

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
| `navigateToSubcategory(name)` | Click subcategory by name (`Desktops`, `Notebooks`, `Accessories`) |

---

### ElectronicsPage (`pageobjects/ElectronicsPage.ts`)

Covers the `/electronics` category page.

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
| `navigateToSubcategory(name)` | Click subcategory by name (`Camera, photo`, `Cell phones`) |

---

### PageObjectManager (`pageobjects/PageObjectManager.ts`)

Central class that instantiates all page objects. Use this in every test instead of creating page objects individually.

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

```typescript
import { PageObjectManager } from '../pageobjects/PageObjectManager';

const pom = new PageObjectManager(page);

const homePage        = pom.getHomePage();
const loginPage       = pom.getLoginPage();
const registerPage    = pom.getRegisterPage();
const cartPage        = pom.getCartPage();
const wishlistPage    = pom.getWishlistPage();
const booksPage       = pom.getBooksPage();
const computersPage   = pom.getComputersPage();
const electronicsPage = pom.getElectronicsPage();
```

---

## Utilities

### `utils/testdata.json`

Holds static input data used across tests. Update this file to change test inputs.

```json
{
  "newUser": {
    "gender": "male",
    "firstName": "John",
    "lastName": "Doe",
    "emailPrefix": "johndoe",
    "password": "Test@1234"
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
| `CredentialManager.save({ email, password })` | Appends new credentials to the array in `credentials.json`. Old entries are preserved. |
| `CredentialManager.load()` | Returns the most recently saved credentials (last entry in array). Throws an error if the file is empty. |
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
const allCredentials = CredentialManager.loadAll();
console.log(`Total registered users: ${allCredentials.length}`);
```

---

## Test Scenarios

### Registration Only (`tests/registration.spec.ts`)

Registers a new user and appends credentials to `credentials.json`.

| Step | Action | Assertion |
|---|---|---|
| 1 | Navigate to `/register` | URL matches `/register` |
| 2 | Fill form with data from `testdata.json` | — |
| 3 | Submit registration form | Result message contains `Your registration completed` |
| 4 | Append credentials to `credentials.json` | New entry added, old entries preserved |

**Allure Annotations:**

| Annotation | Value |
|---|---|
| Epic | User Account Management |
| Feature | Registration |
| Story | As a new user, I want to register an account |
| Severity | Critical |
| Tags | Registration, Regression |
| Attachments | Test Input Data (JSON), Registration Result (text), All Saved Credentials (JSON) |

---

### E2E: Registration and Login (`tests/registration_login.spec.ts`)

Covers the complete new user journey from registration through to login.

| Step | Action | Assertion |
|---|---|---|
| 1 | Navigate to `/register` | URL matches `/register` |
| 2 | Fill form with data from `testdata.json` (gender, name, unique email, password) | — |
| 3 | Submit registration form | Result message contains `Your registration completed` |
| 4 | Append credentials to `credentials.json` via `CredentialManager` | New entry added, old entries preserved |
| 5 | Navigate to `/login` | URL matches `/login` |
| 6 | Load latest credentials from `credentials.json` and login | `.account` link and logout icon are visible |

**Allure Annotations:**

| Annotation | Value |
|---|---|
| Epic | User Account Management |
| Feature | Registration & Login |
| Story | As a new user, I want to register and login to my account |
| Severity | Critical |
| Tags | E2E, Regression, Authentication |
| Owner | QA Team |
| Link | https://demowebshop.tricentis.com |
| Parameters | Gender, First Name, Last Name, Email, Login Email |
| Attachments | Test Input Data (JSON), Registration Result (text), Saved Credentials (JSON) |

---

## NPM Scripts

All scripts are defined in `package.json` and can be run with `npm run <script>`.

| Script | Command | Description |
|---|---|---|
| `npm test` | `playwright test` | Run all tests |
| `npm run test:headed` | `playwright test --headed` | Run tests with visible browser |
| `npm run test:ui` | `playwright test --ui` | Open Playwright interactive UI mode |
| `npm run test:debug` | `playwright test --debug` | Run tests in debug mode |
| `npm run allure:generate` | `allure generate allure-results --clean` | Generate Allure report from results |
| `npm run allure:open` | `allure open` | Open the last generated Allure report |
| `npm run allure:serve` | `allure serve allure-results` | Generate and instantly serve Allure report |
| `npm run report:html` | `playwright show-report` | Open the Playwright HTML report |
| `npm run test:allure` | `playwright test && allure generate allure-results --clean && allure open` | Run all tests then generate and open Allure report |

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
```

### Run in headed mode (visible browser)
```bash
npm run test:headed
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

The Allure report provides rich, visual test results with step-by-step breakdowns, attachments, and metadata.

**Generate and open:**
```bash
npm run allure:generate
npm run allure:open
```

**Or serve instantly (no separate open needed):**
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

When you open the Allure report, here is what you will see for each test:

### Overview Panel
- **Epic / Feature / Story** hierarchy for easy navigation and filtering
- **Severity** badge (e.g., Critical)
- **Tags** (E2E, Regression, Authentication)
- **Owner** of the test
- **Clickable link** to the application under test

### Test Description
Each test includes a full HTML description with:
- **Test Objective** — what the test verifies
- **Pre-conditions** — what must be true before the test runs
- **Test Steps** — numbered list of all actions
- **Expected Result** — what success looks like
- **Test Data Source** — where the input data comes from

### Step Breakdown
Steps are nested for full visibility:

```
Step 1: Register a new user
  ├── Navigate to the Registration page (/register)
  ├── Fill in personal details — John Doe (male)
  ├── Submit the registration form
  ├── Verify registration success message is displayed
  └── Save credentials to credentials.json for reuse

Step 2: Navigate to the Login page
  ├── Go to the Login page (/login)
  └── Verify the current URL is the Login page

Step 3: Login using saved credentials
  ├── Load saved credentials from credentials.json
  ├── Enter email and password and submit the login form
  ├── Verify user is logged in — account link is visible
  └── Verify user is logged in — logout button is visible
```

### Parameters
Each step shows its parameters in a table:

| Parameter | Example Value |
|---|---|
| Gender | male |
| First Name | John |
| Last Name | Doe |
| Email | johndoe+1234567890@test.com |
| Login Email | johndoe+1234567890@test.com |
| Password | ***hidden*** |
| Total Credentials Stored | 3 |

### Attachments
The following files are attached to the test run and viewable in the report:

| Attachment | Type | Contents |
|---|---|---|
| Test Input Data | JSON | gender, firstName, lastName, generatedEmail |
| Registration Result Message | Text | Actual success message from the UI |
| Saved Credentials | JSON | email (password hidden) |
| All Saved Credentials | JSON | Full list of all stored credentials (passwords hidden) |

---

## .gitignore

The following folders are excluded from version control:

| Folder | Reason |
|---|---|
| `node_modules/` | Third-party dependencies — restored via `npm install` |
| `test-results/` | Playwright test artifacts (screenshots, videos, traces) |
| `playwright-report/` | Playwright HTML report output |
| `blob-report/` | Playwright blob reporter output |
| `allure-results/` | Raw Allure test result files generated per run |
| `allure-report/` | Generated Allure HTML report |

> Never commit `allure-results/` or `allure-report/` — these are generated locally on each run using `npm run allure:generate`.

---

## How to Add a New Test

1. **Create a page object** (if needed) in `pageobjects/` following the pattern of existing pages.
2. **Register it** in `PageObjectManager.ts` with a getter method.
3. **Add test data** to `utils/testdata.json` if the test needs static input.
4. **Create a spec file** in `tests/` following the `*.spec.ts` naming convention.
5. **Use `PageObjectManager`** to access page objects.
6. **Add Allure annotations** so the report is descriptive.

```typescript
import { test, expect } from '@playwright/test';
import { epic, feature, story, severity, owner, tag, description, step } from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { PageObjectManager } from '../pageobjects/PageObjectManager';

test('My new test scenario', async ({ page }) => {
  await epic('My Epic');
  await feature('My Feature');
  await story('My Story');
  await severity(Severity.NORMAL);
  await tag('Regression');
  await owner('QA Team');
  await description('Describe what this test verifies.');

  const pom = new PageObjectManager(page);

  await test.step('Step 1: Description', async () => {
    await step('Sub-step detail', async () => {
      // actions and assertions
    });
  });
});
```
