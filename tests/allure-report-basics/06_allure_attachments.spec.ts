import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/*
  SCRIPT 06 - Allure Attachments (Text, JSON, HTML)
  ===================================================
  This script shows how to attach different types of content to Allure report:

  1. Text attachment    - plain text like logs, messages
  2. JSON attachment    - test data in JSON format
  3. HTML attachment    - formatted HTML content
  4. Page source        - the HTML source code of the page

  Attachments help you understand:
  - What data was sent to the API or form
  - What the page looked like at a certain point
  - What error message was received
*/

test('Attach different types of content to Allure report', async ({ page }) => {

  await allure.description('This test demonstrates attaching text, JSON, and HTML content to Allure report');
  await allure.severity('normal');

  // ---- ATTACHMENT 1: Plain Text ----
  await allure.step('Step 1: Attach plain text log', async () => {

    const logMessage = `
      Test started at: ${new Date().toISOString()}
      Browser: Chromium
      Environment: QA
      Tester: John
    `;

    // Attach plain text to report
    await allure.attachment('Test Log', logMessage, 'text/plain');

  });


  // ---- ATTACHMENT 2: JSON Data ----
  await allure.step('Step 2: Attach JSON test data', async () => {

    const testData = {
      username: 'student',
      password: 'Password123',
      environment: 'QA',
      browser: 'Chromium',
      timestamp: new Date().toISOString()
    };

    // Convert object to JSON string and attach
    const jsonString = JSON.stringify(testData, null, 2);
    await allure.attachment('Test Data (JSON)', jsonString, 'application/json');

  });


  // ---- ATTACHMENT 3: HTML Content ----
  await allure.step('Step 3: Attach HTML content', async () => {

    const htmlContent = `
      <html>
        <body>
          <h2>Test Summary</h2>
          <table border="1">
            <tr><th>Field</th><th>Value</th></tr>
            <tr><td>Test Name</td><td>Login Test</td></tr>
            <tr><td>Status</td><td style="color:green">PASSED</td></tr>
            <tr><td>Duration</td><td>2.5 seconds</td></tr>
          </table>
        </body>
      </html>
    `;

    await allure.attachment('Test Summary (HTML)', htmlContent, 'text/html');

  });


  // ---- ATTACHMENT 4: Page Source Code ----
  await allure.step('Step 4: Open page and attach page source', async () => {

    await page.goto('https://www.google.com');

    // Get the HTML source of the current page
    const pageSource = await page.content();
    await allure.attachment('Page Source Code', pageSource, 'text/html');

  });


  // ---- ATTACHMENT 5: Screenshot ----
  await allure.step('Step 5: Attach a screenshot', async () => {

    const screenshot = await page.screenshot();
    await allure.attachment('Final Screenshot', screenshot, 'image/png');

  });

  // Verify page loaded
  await expect(page).toHaveTitle(/Google/);

});
