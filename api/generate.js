const chrome = require('chrome-aws-lambda');

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
    browser = await chrome.puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless
    });

    const page = await browser.newPage();
    
    await page.setViewport({ width: 1080, height: 1920 });
    await page.setContent(html);
    
    const screenshot = await page.screenshot({ type: 'png' });
    
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    return res.send(screenshot);

  } catch (err) {
    if (browser) await browser.close();
    return res.status(500).json({ error: err.message });
  }
};
