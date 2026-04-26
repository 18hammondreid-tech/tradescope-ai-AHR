import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'public', 'ahr-stories.html');

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

// Wait extra for Google Fonts
await new Promise(r => setTimeout(r, 3000));

const stories = ['story1', 'story2', 'story3'];
const names = ['ahr-story-1-rebuilt', 'ahr-story-2-quote-engine', 'ahr-story-3-cta'];

for (let i = 0; i < stories.length; i++) {
  const el = await page.$(`#${stories[i]}`);
  const outPath = path.join(__dirname, 'public', `${names[i]}.png`);
  await el.screenshot({ path: outPath });
  console.log(`Saved: ${outPath}`);
}

await browser.close();
console.log('Done.');
