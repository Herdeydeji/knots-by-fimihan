import { chromium } from 'playwright';

const BASE = 'https://knotbyfimihan-herdeydeji.vercel.app';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.USERPROFILE + '\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe'
  });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));
  page.on('pageerror', err => logs.push('PAGE ERROR: ' + err.message));

  // Step 1: Go to login page
  await page.goto(BASE + '/login', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('1. Login page loaded');
  let text = await page.textContent('body');
  console.log('   Body contains Sign In:', text.includes('Sign In'));

  // Step 2: Fill login form (prompt for credentials in CI)
  const testEmail = process.env.TEST_EMAIL || 'adedejiadebeso@gmail.com';
  const testPassword = process.env.TEST_PASSWORD || '';
  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPassword);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  console.log('2. After login, URL:', page.url());

  // Step 3: Navigate to admin chat
  await page.goto(BASE + '/admin/chat', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('3. Admin chat URL:', page.url());
  text = await page.textContent('body');
  console.log('   Page text:', text.substring(0, 800));
  console.log('   Has Conversations:', text.includes('Conversations'));
  console.log('   Has Live Chat:', text.includes('Live Chat'));

  // Step 4: Check for errors
  console.log('4. Console errors:', logs.filter(l => l.startsWith('PAGE ERROR')).join(' | '));

  // Step 5: Take screenshot
  await page.screenshot({ path: 'admin-chat-test.png', fullPage: true });
  console.log('5. Screenshot saved to admin-chat-test.png');

  await browser.close();
}

run().catch(err => { console.error('TEST FAILED:', err.message); process.exit(1); });
