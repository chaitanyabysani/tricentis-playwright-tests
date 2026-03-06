# Tricentis Playwright Tests

## Project Overview
Playwright test automation project targeting the Tricentis Demo Web Shop (`https://demowebshop.tricentis.com/`).

## Tech Stack
- **Framework**: Playwright (`@playwright/test` v1.58.x)
- **Language**: TypeScript
- **Reporters**: HTML, Line, Allure (`allure-playwright`)
- **Browser**: Chromium (headless)

## Commands

### Run all tests
```bash
npx playwright test
```

### Run a specific test file
```bash
npx playwright test tests/example.spec.ts
```

### Run with UI mode
```bash
npx playwright test --ui
```

### Run headed (visible browser)
```bash
npx playwright test --headed
```

### View HTML report
```bash
npx playwright show-report
```

### Generate Allure report
```bash
npx allure generate allure-results --clean && npx allure open
```

## Project Structure
```
tricentis-playwright-tests/
├── tests/              # Test spec files (*.spec.ts)
├── playwright.config.ts
├── package.json
└── CLAUDE.md
```

## Configuration (`playwright.config.ts`)
- **Base URL**: `https://demowebshop.tricentis.com/`
- **Test timeout**: 30 seconds
- **Expect timeout**: 5 seconds
- **Retries**: 0
- **Screenshots**: on
- **Video**: on
- **Trace**: on

## Conventions
- Test files go in `tests/` and follow `*.spec.ts` naming
- Use Playwright's built-in locators (`getByRole`, `getByText`, `getByLabel`, etc.) over CSS/XPath selectors
- Group related tests using `test.describe` blocks
- Use `baseURL` from config — avoid hardcoding the full URL in tests (use relative paths like `/login`)
