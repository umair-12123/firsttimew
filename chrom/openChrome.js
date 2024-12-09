const puppeteer = require('puppeteer');

// List of proxy servers
const proxies = [
  'http://103.152.112.120:80',
  'http://140.246.149.224:8888',
  'http://47.112.102.20:80',
  'http://13.125.194.158:10040',
  // Add more proxies here
];

async function tryNavigate(page, url, retries = 3) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      // Navigate to the video URL
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 180000 }); // 3 minutes timeout
      console.log(`Video opened successfully: ${url}`);
      return;
    } catch (error) {
      attempt++;
      console.log(`Error occurred, retrying... Attempt ${attempt} of ${retries}: ${error}`);
      if (attempt === retries) {
        console.error('Max retries reached, failed to open video.');
        throw error;
      }
      await page.waitForTimeout(1000); // Wait for 1 second before retrying
    }
  }
}

async function changeProxy(browser) {
  const newProxy = proxies[Math.floor(Math.random() * proxies.length)];
  console.log(`Switching to proxy ${newProxy}`);
  
  // Close current browser instance and launch a new one with a different proxy
  await browser.close();
  return await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--ignore-certificate-errors', `--proxy-server=${newProxy}`],
  });
}

async function main() {
  let browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--ignore-certificate-errors'],
  });
  let page = await browser.newPage();
  
  const videoUrl = 'https://vm.tiktok.com/ZSj3kgYG7/';
  let videoIndex = 1;
  let currentDelay = 3; // Start with 3 seconds for the first video
  
  for (videoIndex; videoIndex <= 100; videoIndex++) {
    console.log(`Opening video ${videoIndex}/100...`);

    try {
      // Try to navigate to the video
      await tryNavigate(page, videoUrl);
      
      // Simulate watching the video for the duration of `currentDelay` seconds
      await page.waitForTimeout(currentDelay * 1000); // Convert seconds to milliseconds
      console.log(`Watched video for ${currentDelay} seconds.`);

      // Increase the video playtime by 3-4 seconds for the next loop
      currentDelay += Math.floor(Math.random() * 2) + 3; // Randomly increase delay by 3-4 seconds
    } catch (error) {
      console.error('Error opening video:', error);
      // Switch to a new proxy if failed
      browser = await changeProxy(browser);
      page = await browser.newPage(); // Create a new page instance after switching proxy
    }
    
    // Random delay of 1-2 seconds before going to the next video
    const randomDelay = Math.floor(Math.random() * 2) + 1;
    console.log(`Waiting for ${randomDelay} seconds before next video.`);
    await page.waitForTimeout(randomDelay * 1000); // Random delay (1-2 seconds)
  }
  
  console.log('Completed all video openings.');
  await browser.close();
}

main().catch(error => console.error('An error occurred:', error));
