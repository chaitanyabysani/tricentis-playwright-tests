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
- [Running Tests](#running-tests)
- [Reports](#reports)
- [How to Add a New Test](#how-to-add-a-new-test)

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation framework |
| TypeScript | Strongly-typed test scripting |
| HTML Reporter | Built-in Playwright test report |
| Allure Reporter | Rich visual test reporting |
| Node.js | Runtime environment |

---

## Project Structure

```
tricentis-playwright-tests/
│
├── pageobjects/                  # Page Object classes
│   ├── HomePage.ts               # Home page elements and actions
│   ├── LoginPage.ts              # Login page elements and actions
│   ├── RegisterPage.ts           # Register page elements and actions
│   └── PageObjectManager.ts     # Central manager for all page objects
│
├── tests/                        # Test spec files
│   ├── example.spec.ts           # Default Playwright sample test
│   └── registration_login.spec.ts # E2E: Registration and Login scenario
│
├── utils/                        # Utilities and test data
│   ├── testdata.json             # Static input data for tests
│   ├── credentials.json          # Runtime-saved user credentials
│   └── CredentialManager.ts     # Helper to save/load credentials
│
├── playwright.config.ts          # Playwright configuration
├── package.json
├── CLAUDE.md                     # Claude Code project instructions
└── README.md                     # Project documentation
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

All configuration is in `playwright.config.ts`:

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

---

## Page Objects

All page object files are in the `pageobjects/` folder.

### HomePage (`pageobjects/HomePage.ts`)

Covers the main landing page of the shop.

| Element | Description |
|---|---|
| `registerLink` | Header Register link |
| `loginLink` | Header Log in link |
| `cartLink` | Shopping cart indicator |
| `wishlistLink` | Wishlist indicator |
| `searchInput` | Search bar input |
| `searchButton` | Search submit button |
| `booksMenu` | Books category nav link |
| `computersMenu` | Computers category nav link |
| `electronicsMenu` | Electronics category nav link |
| `apparelMenu` | Apparel & Shoes category nav link |
| `digitalDownloadsMenu` | Digital downloads nav link |
| `jewelryMenu` | Jewelry nav link |
| `giftCardsMenu` | Gift Cards nav link |
| `newsletterEmailInput` | Newsletter email input |
| `newsletterSubscribeButton` | Newsletter subscribe button |

| Method | Description |
|---|---|
| `goto()` | Navigate to home page |
| `search(term)` | Search for a product |
| `navigateToCategory(category)` | Click a navigation menu category |
| `subscribeNewsletter(email)` | Subscribe to newsletter |
| `getFeaturedProductNames()` | Returns all featured product names |
| `clickFeaturedProduct(name)` | Click a featured product by name |

---

### LoginPage (`pageobjects/LoginPage.ts`)

Covers the `/login` page.

| Element | Description |
|---|---|
| `emailInput` | Email address input (`#Email`) |
| `passwordInput` | Password input (`#Password`) |
| `rememberMeCheckbox` | Remember me checkbox (`#RememberMe`) |
| `loginButton` | Login submit button |
| `forgotPasswordLink` | Forgot password link |
| `registerLink` | Register link |
| `emailError` | Email field validation error |
| `passwordError` | Password field validation error |
| `loginError` | Login summary error message |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/login` |
| `login(email, password, rememberMe?)` | Fill and submit login form |
| `getLoginErrorMessage()` | Returns login error text |

---

### RegisterPage (`pageobjects/RegisterPage.ts`)

Covers the `/register` page.

| Element | Description |
|---|---|
| `genderMaleRadio` | Male gender radio button |
| `genderFemaleRadio` | Female gender radio button |
| `firstNameInput` | First name input (`#FirstName`) |
| `lastNameInput` | Last name input (`#LastName`) |
| `emailInput` | Email input (`#Email`) |
| `passwordInput` | Password input (`#Password`) |
| `confirmPasswordInput` | Confirm password input (`#ConfirmPassword`) |
| `registerButton` | Register submit button |
| `registerResultMessage` | Success/failure result message |
| `continueButton` | Continue link after registration |
| `firstNameError` | First name validation error |
| `lastNameError` | Last name validation error |
| `emailError` | Email validation error |
| `passwordError` | Password validation error |
| `confirmPasswordError` | Confirm password validation error |

| Method | Description |
|---|---|
| `goto()` | Navigate to `/register` |
| `register(gender, firstName, lastName, email, password)` | Fill and submit registration form |
| `getRegistrationResult()` | Returns the registration result message text |

---

### PageObjectManager (`pageobjects/PageObjectManager.ts`)

Central class that instantiates all page objects. Use this in every test instead of creating page objects individually.

```typescript
import { PageObjectManager } from '../pageobjects/PageObjectManager';

const pom = new PageObjectManager(page);

const homePage     = pom.getHomePage();
const loginPage    = pom.getLoginPage();
const registerPage = pom.getRegisterPage();
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

> The `emailPrefix` is combined with a timestamp (`Date.now()`) at runtime to generate a unique email for each test run, avoiding duplicate registration errors.

---

### `utils/credentials.json`

Stores user credentials written at runtime after a successful registration. This file is automatically populated — do not edit manually.

```json
{
  "email": "johndoe+1234567890@test.com",
  "password": "Test@1234"
}
```

---

### `utils/CredentialManager.ts`

Helper class to save and load credentials from `credentials.json`.

| Method | Description |
|---|---|
| `CredentialManager.save({ email, password })` | Writes credentials to `credentials.json` |
| `CredentialManager.load()` | Reads and returns credentials. Throws an error if file is empty. |

**Usage in any test:**

```typescript
import { CredentialManager } from '../utils/CredentialManager';

// Save
CredentialManager.save({ email: 'user@test.com', password: 'Test@1234' });

// Load
const credentials = CredentialManager.load();
await loginPage.login(credentials.email, credentials.password);
```

---

## Test Scenarios

### E2E: User Registration and Login (`tests/registration_login.spec.ts`)

Covers the complete new user journey from registration to login.

| Step | Action | Assertion |
|---|---|---|
| 1 | Navigate to `/register` and fill the form with data from `testdata.json` | Result message contains `Your registration completed` |
| 2 | Save generated credentials to `credentials.json` via `CredentialManager` | Credentials file is updated |
| 3 | Navigate to `/login` | URL matches `/login` |
| 4 | Login using credentials loaded from `credentials.json` | `.account` link and logout icon are visible |

---

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run a specific test file
```bash
npx playwright test tests/registration_login.spec.ts
```

### Run in headed mode (visible browser)
```bash
npx playwright test --headed
```

### Run in UI mode (interactive)
```bash
npx playwright test --ui
```

### Run with a specific browser
```bash
npx playwright test --browser=firefox
```

### Debug a test
```bash
npx playwright test --debug
```

---

## Reports

### HTML Report

Auto-generated after each run. Open with:

```bash
npx playwright show-report
```

### Allure Report

Generate and open:

```bash
npx allure generate allure-results --clean
npx allure open
```

> Allure results are saved to `allure-results/` after each test run.

---

## How to Add a New Test

1. **Create a page object** (if needed) in `pageobjects/` extending the pattern of existing pages.
2. **Register it** in `PageObjectManager.ts`.
3. **Add test data** to `utils/testdata.json` if the test needs input data.
4. **Create a spec file** in `tests/` following the `*.spec.ts` naming convention.
5. **Use `PageObjectManager`** to access page objects in your test.

```typescript
import { test, expect } from '@playwright/test';
import { PageObjectManager } from '../pageobjects/PageObjectManager';

test('My new test', async ({ page }) => {
  const pom = new PageObjectManager(page);

  await test.step('Step description', async () => {
    // your actions and assertions
  });
});
```
