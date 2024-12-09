import puppeteer from 'puppeteer-core';
import GoLogin from 'gologin';

(async () => {
  const GL = new GoLogin({
    token: 'YOUR_API_TOKEN', // Replace with your API token
    profile_id: 'YOUR_PROFILE_ID', // Replace with your Profile ID
  });

  const { status, wsUrl } = await GL.start().catch((e) => {
    console.error('Error starting GoLogin profile:', e);
    return { status: 'failure' };
  });

  if (status !== 'success') {
    console.error('Failed to start browser profile.');
    return;
  }

  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl.toString(),
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  await page.goto('https://myip.link/mini');
  console.log(await page.content());

  await browser.close();
  await GL.stop();
})();
