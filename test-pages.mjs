import { chromium } from 'playwright';
import { fileURLToPath } from 'url';

const BASE = 'https://knotbyfimihan.netlify.app';

const tests = [
  { route: '/', name: 'Homepage', check: (t) => t.includes('Dress Modestly') || t.includes('Knots') },
  { route: '/shop', name: 'Shop', check: (t) => t.includes('products') || t.includes('Shop') },
  { route: '/product/emerald-grace-abaya', name: 'Product Detail', check: (t) => t.includes('Emerald Grace') },
  { route: '/category/abayas', name: 'Category (Abayas)', check: (t) => t.includes('Abayas') },
  { route: '/cart', name: 'Cart', check: (t) => t.includes('Cart') || t.includes('Empty') },
  { route: '/about', name: 'About', check: (t) => t.includes('Story') || t.includes('Fimihan') },
  { route: '/contact', name: 'Contact', check: (t) => t.includes('Touch') || t.includes('Contact') },
  { route: '/search', name: 'Search', check: (t) => t.includes('Search') },
  { route: '/admin/dashboard', name: 'Admin Dashboard (redirect to login)', check: (t) => t.includes('Sign In') || t.includes('email') },
  { route: '/admin/products', name: 'Admin Products (redirect to login)', check: (t) => t.includes('Sign In') || t.includes('email') },
  { route: '/admin/orders', name: 'Admin Orders (redirect to login)', check: (t) => t.includes('Sign In') || t.includes('email') },
  { route: '/admin/products/new', name: 'Admin Add Product (redirect to login)', check: (t) => t.includes('Sign In') || t.includes('email') },
  { route: '/admin/chat', name: 'Admin Chat (redirect to login)', check: (t) => t.includes('Sign In') || t.includes('email') },
  { route: '/checkout', name: 'Checkout (empty cart)', check: (t) => t.includes('/cart') },
  { route: '/order-success', name: 'Order Success (no state)', check: (t) => t.includes('/') },
];

async function run() {
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: `${process.env.USERPROFILE}\\AppData\\Local\\ms-playwright\\chromium-1223\\chrome-win64\\chrome.exe`
  });
  const results = [];

  for (const test of tests) {
    try {
      const page = await browser.newPage();
      const response = await page.goto(`${BASE}${test.route}`, { 
        waitUntil: 'networkidle',
        timeout: 15000 
      });
      
      const status = response?.status() || 0;
      const text = await page.textContent('body');
      const title = await page.title();
      const url = page.url();
      
      const passed = status < 400 && test.check(text);
      results.push({ 
        name: test.name, 
        status: passed ? 'PASS' : 'FAIL', 
        statusCode: status,
        title,
        url: url.replace(BASE, '')
      });
      
      await page.close();
    } catch (err) {
      results.push({ 
        name: test.name, 
        status: 'ERROR', 
        error: err.message.substring(0, 100)
      });
    }
  }

  await browser.close();

  console.log('\n=== Knots by Fimihan — Page Test Results ===\n');
  const passed = results.filter(r => r.status === 'PASS').length;
  const total = results.length;
  
  for (const r of results) {
    const icon = r.status === 'PASS' ? '✓' : r.status === 'ERROR' ? '✗' : '✗';
    console.log(`  ${icon} ${r.name}: ${r.status}${r.url ? ` (${r.url})` : ''}${r.error ? ` — ${r.error}` : ''}`);
  }
  
  console.log(`\n  ${passed}/${total} pages passed\n`);
  process.exit(passed === total ? 0 : 1);
}

run();
