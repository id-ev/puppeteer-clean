const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html } = req.body;
  
  if (!html) {
    return res.status(400).json({ error: 'HTML required' });
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();
    
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const screenshot = await page.screenshot({ type: 'png' });
    
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    return res.send(screenshot);

  } catch (err) {
    if (browser) await browser.close();
    return res.status(500).json({ error: err.message });
  }
};
```

3. **Commit changes**

4. **Подождите деплой** (3-4 минуты, т.к. новые пакеты)

5. **Проверьте:**
```
https://id-ev.ru/magic-epil-stories/id-ev-content/test_generation.php
```

---

## 🎯 ДОЛЖНО ЗАРАБОТАТЬ!

В логах билда увидите:
```
Installing dependencies...
@sparticuz/chromium@123.0.1
puppeteer-core@23.1.0

✅ Build successful
