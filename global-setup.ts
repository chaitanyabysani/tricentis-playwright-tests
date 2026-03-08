import * as fs from 'fs';
import * as path from 'path';

async function globalSetup() {
  const resultsDir = path.join(process.cwd(), 'allure-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const envContent = [
    'Browser=Chromium',
    'Base URL=https://demowebshop.tricentis.com',
    'Environment=QA',
    'Platform=Windows 11',
    'Test Framework=Playwright',
    'Language=TypeScript',
  ].join('\n');

  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), envContent, 'utf8');
}

export default globalSetup;
