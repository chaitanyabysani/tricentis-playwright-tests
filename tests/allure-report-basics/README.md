# Allure Reports - Playwright Scripts
========================================

This folder contains separate scripts for each Allure feature.
Each script is well commented and beginner friendly.

---

## Scripts Overview

| Script File | What it Covers |
|---|---|
| 01_basic_description_severity.spec.ts | Description, Severity, Owner, Tags |
| 02_allure_steps.spec.ts | Breaking tests into clear steps |
| 03_screenshots_attachment.spec.ts | Taking and attaching screenshots |
| 04_epic_feature_story.spec.ts | Organizing tests with Epic, Feature, Story |
| 05_allure_parameters.spec.ts | Adding test data as parameters |
| 06_allure_attachments.spec.ts | Attaching text, JSON, HTML content |
| 07_allure_with_hooks.spec.ts | Using Allure inside beforeEach / afterEach |
| 08_allure_links.spec.ts | Linking to Jira, TestRail, documents |
| 09_complete_example.spec.ts | All features combined in one test |

---

## How to Run

### Run all scripts:
```bash
npx playwright test
```

### Run a single script:
```bash
npx playwright test 01_basic_description_severity.spec.ts
```

### Generate Allure Report:
```bash
npx allure generate allure-results --clean -o allure-report
```

### Open Allure Report:
```bash
npx allure open allure-report
```

### One command to run tests + generate + open report:
```bash
npm run allure:report
```

---

## Important - Common Import Errors and Fixes

---

### Error 1: Deprecated Import Warning
If you see this error:
```
'allure' is deprecated.
```

This means you are using the old import. Follow these 2 steps to fix it:

**Step 1: Install the new package**
```bash
npm install --save-dev allure-js-commons
```

**Step 2: Replace the import in all your scripts**

Old way (deprecated ❌):
```typescript
import { allure } from 'allure-playwright';
```

Fix - use allure-js-commons ✅:
```typescript
import { allure } from 'allure-js-commons';
```

---

### Error 2: Cannot read properties of undefined
If you see this error:
```
TypeError: Cannot read properties of undefined (reading 'description')
```

This means `allure` is coming as undefined — the named import is not working correctly.

Old way that causes undefined ❌:
```typescript
import { allure } from 'allure-js-commons';
```

Correct way ✅:
```typescript
import * as allure from 'allure-js-commons';
```

**Why does this happen?**

| Import Style | What happens |
|---|---|
| `import { allure } from 'allure-js-commons'` | Sometimes returns undefined in certain versions ❌ |
| `import * as allure from 'allure-js-commons'` | Imports everything correctly ✅ |

---

### Final Correct Import to use in ALL scripts ✅
```typescript
import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
```

---

## Required Setup

### 1. Install packages:
```bash
npm install --save-dev allure-playwright
npm install --save-dev allure-commandline
npm install --save-dev allure-js-commons
```

### 2. Update playwright.config.ts:
```typescript
reporter: [
  ['line'],
  ['allure-playwright']
],
use: {
  screenshot: 'on',
  video: 'on',
  trace: 'on',
}
```

### 3. Add scripts to package.json:
```json
"scripts": {
  "test": "npx playwright test",
  "allure:generate": "npx allure generate allure-results --clean -o allure-report",
  "allure:open": "npx allure open allure-report",
  "allure:report": "npm run allure:generate && npm run allure:open"
}
```

### 4. Make sure Java is installed:
```bash
java -version
```

---

## Allure Features Summary

| Feature | Method | Purpose |
|---|---|---|
| Description | allure.description() | Explain what the test does |
| Severity | allure.severity() | How critical is the test |
| Epic | allure.epic() | Top level grouping |
| Feature | allure.feature() | Feature grouping |
| Story | allure.story() | User story grouping |
| Owner | allure.owner() | Who wrote the test |
| Tag | allure.tag() | Labels for filtering |
| Step | allure.step() | Break test into steps |
| Parameter | allure.parameter() | Show test data used |
| Attachment | allure.attachment() | Attach files/screenshots |
| Issue Link | allure.issue() | Link to bug in Jira |
| TMS Link | allure.tms() | Link to TestRail test case |
| Custom Link | allure.link() | Link to any URL |