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
├── pageobjects/                   # Page Object classes
│   ├── HomePage.ts                # Home page elements and actions
│   ├── LoginPage.ts               # Login page elements and actions
│   ├── RegisterPage.ts            # Register page elements and actions
│   └── PageObjectManager.ts      # Central manager for all page objects
│
├── tests/                         # Test spec files
│   ├── example.spec.ts            # Default Playwright sample test
│   └── registration_login.spec.ts # E2E: Registration and Login scenario
│
├── utils/                         # Utilities and test data
│   ├── testdata.json              # Static input data for tests
│   ├── credentials.json           # Runtime-saved user credentials
│   └── CredentialManager.ts      # Helper to save/load credentials
│
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript compiler configuration
├── package.json                   # Dependencies and npm scripts
├── CLAUDE.md                      # Claude Code project instructions
└── README.md                      # Project documentation
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

> The `emailPrefix` is combined with a `Date.now()` timestamp at runtime to generate a unique email per test run, avoiding duplicate registration errors.

---

### `utils/credentials.json`

Stores user credentials written at runtime after a successful registration. This file is **automatically populated by the test** — do not edit manually.

```json
{
  "email": "johndoe+1234567890@test.com",
  "password": "Test@1234"
}
```

> These credentials can be reused in any other test scenario by using `CredentialManager.load()`.

---

### `utils/CredentialManager.ts`

Helper class to save and load credentials from `credentials.json`.

| Method | Description |
|---|---|
| `CredentialManager.save({ email, password })` | Writes credentials to `credentials.json` |
| `CredentialManager.load()` | Reads and returns credentials. Throws a clear error if the file is empty (i.e., registration test has not run yet). |

**Usage in any test:**

```typescript
import { CredentialManager } from '../utils/CredentialManager';

// Save after registration
CredentialManager.save({ email: 'user@test.com', password: 'Test@1234' });

// Load in any test
const credentials = CredentialManager.load();
await loginPage.login(credentials.email, credentials.password);
```

---

## Test Scenarios

### E2E: User Registration and Login (`tests/registration_login.spec.ts`)

Covers the complete new user journey from registration to login.

| Step | Action | Assertion |
|---|---|---|
| 1 | Navigate to `/register` | URL matches `/register` |
| 2 | Fill form with data from `testdata.json` (gender, name, unique email, password) | — |
| 3 | Submit registration form | Result message contains `Your registration completed` |
| 4 | Save credentials to `credentials.json` via `CredentialManager` | Credentials file is updated |
| 5 | Navigate to `/login` | URL matches `/login` |
| 6 | Load credentials from `credentials.json` and login | `.account` link and logout icon are visible |

**Allure Annotations on this test:**

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

### Attachments
The following files are attached to the test run and viewable in the report:

| Attachment | Type | Contents |
|---|---|---|
| Test Input Data | JSON | gender, firstName, lastName, generatedEmail |
| Registration Result Message | Text | Actual success message from the UI |
| Saved Credentials | JSON | email (password hidden) saved to credentials.json |

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
