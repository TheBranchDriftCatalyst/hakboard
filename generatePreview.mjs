import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

(async () => {
  try {
    // TODO: fix this... for some reason puppeteer is just hanging
    const browser = await puppeteer.launch({ 
      devtools: false, 
      headless: false,
      dumpio: true,
      args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    console.log("Navigating to the URL...");
    // Assuming you want to navigate to a specific URL, like your local dev server
    await page.goto("http://localhost:3000");
    await page._client.send('Animation.setPlaybackRate', { playbackRate: 1000 });
    await page.waitForTimeout(1000);

    console.log("Taking screenshot...");
    // Define the path for the screenshot
    const screenshotPath = path.resolve('public', 'preview.png');
    // Ensure the directory exists
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    // Take a full-page screenshot
    await page.screenshot({ path: screenshotPath, fullPage: true });

    await browser.close();
    console.log("Preview generated successfully.");
  } catch (error) {
    console.error("Failed to generate preview:", error);
    throw error; // Or handle it as per your application's error handling policies
  }
  
})();

// export const generatePreview = async () => {
//   try {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     console.log("Navigating to the URL...");
//     // Assuming you want to navigate to a specific URL, like your local dev server
//     await page.goto("http://localhost:3000");
//     await page._client.send('Animation.setPlaybackRate', { playbackRate: 1000 });
//     await page.waitForTimeout(1000);

//     console.log("Taking screenshot...");
//     // Define the path for the screenshot
//     const screenshotPath = path.resolve('public', 'preview.png');
//     // Ensure the directory exists
//     fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
//     // Take a full-page screenshot
//     await page.screenshot({ path: screenshotPath, fullPage: true });

//     await browser.close();
//     console.log("Preview generated successfully.");
//     return screenshotPath
//   } catch (error) {
//     console.error("Failed to generate preview:", error);
//     throw error; // Or handle it as per your application's error handling policies
//   }
// };

// generatePreview().then((path) => {
//   console.log('Preview generated successfully', path);
//   process.exit(0);
// });