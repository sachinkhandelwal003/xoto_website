const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // 1. Login
  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Use placeholder-based selector since input type is "text"
  await page.fill('input[placeholder="Email Address"]', 'Super1@gmail.com');
  await page.fill('input[type="password"]', 'Super1@2024');
  console.log('Filled login form');

  await page.click('button[type="submit"]');
  await page.waitForTimeout(8000);
  console.log('POST-LOGIN URL:', page.url());

  const body = await page.evaluate(() => document.body.innerText.substring(0, 300));
  console.log('BODY:', body);

  // 2. Take screenshot of dashboard
  await page.screenshot({ path: 'C:/Users/user/AppData/Local/Temp/login-result.png' });

  // 3. Test roles route
  await page.goto('http://localhost:5173/dashboard/superadmin/roles', { waitUntil: 'domcontentloaded', timeout: 12000 });
  await page.waitForTimeout(4000);
  const rolesText = await page.evaluate(() => {
    const m = document.querySelector('main');
    return m ? m.innerText.substring(0, 500) : 'NO MAIN | ' + document.body.innerText.substring(0, 300);
  });
  console.log('\n=== ROLES:', rolesText);
  await page.screenshot({ path: 'C:/Users/user/AppData/Local/Temp/roles-page.png' });

  // 4. Test permission route
  await page.goto('http://localhost:5173/dashboard/superadmin/permission', { waitUntil: 'domcontentloaded', timeout: 12000 });
  await page.waitForTimeout(4000);
  const permText = await page.evaluate(() => {
    const m = document.querySelector('main');
    return m ? m.innerText.substring(0, 500) : 'NO MAIN | ' + document.body.innerText.substring(0, 300);
  });
  console.log('\n=== PERMISSION:', permText);

  // 5. Test superadmin home
  await page.goto('http://localhost:5173/dashboard/superadmin', { waitUntil: 'domcontentloaded', timeout: 12000 });
  await page.waitForTimeout(4000);
  const homeText = await page.evaluate(() => {
    const m = document.querySelector('main');
    return m ? m.innerText.substring(0, 500) : 'NO MAIN | ' + document.body.innerText.substring(0, 300);
  });
  console.log('\n=== SUPERADMIN HOME:', homeText);
  await page.screenshot({ path: 'C:/Users/user/AppData/Local/Temp/superadmin-home.png' });

  await browser.close();
  console.log('\nDone. Screenshots in C:/Users/user/AppData/Local/Temp/');
})().catch(e => console.error('ERROR:', e.message));
