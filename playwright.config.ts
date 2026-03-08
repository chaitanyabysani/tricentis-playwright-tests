import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  retries: 0,

 /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
  
    timeout: 5000
  },
  
  reporter: [
    ['html'],
    ['line'],
    ['allure-playwright'],
  ],
  
  use: {
    
    baseURL: 'https://demowebshop.tricentis.com/',
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    video: 'on',
    trace: 'on',
  },

  
});