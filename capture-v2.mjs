import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'public', 'ahr-ad-v2.html');

const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 3500));

const shots = [
  { id: 'story-1', name: 'ahr-v2-story1-hook' },
  { id: 'story-2', name: 'ahr-v2-story2-system' },
  { id: 'story-3', name: 'ahr-v2-story3-cta' },
];

for (const { id, name } of shots) {
  const el = await page.$(`#${id}`);
  const out = path.join(__dirname, 'public', `${name}.png`);
  await el.screenshot({ path: out });
  console.log(`✓ ${out}`);
}

await browser.close();
console.log('Done.');
