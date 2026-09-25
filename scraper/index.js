#!/usr/bin/env node

/**
 * Container tracking scraper CLI.
 *
 * Usage:
 *   node scraper/index.js <adapter> <containerNumber> [--headed] [--screenshot=<path>] [--timeout=<ms>]
 *
 * Prints a single JSON object to stdout:
 *   { ok: true,  adapter, container, rows: [{ type, date, event, place, source }] }
 *   { ok: false, adapter, container, error }
 *
 * Exit codes: 0 success, 1 scrape failure, 2 usage error.
 */

const fs = require('fs');
const path = require('path');

function usageError(message) {
  process.stderr.write(message + '\n');
  process.stderr.write('Usage: node scraper/index.js <adapter> <containerNumber> [--headed] [--screenshot=<path>] [--timeout=<ms>]\n');
  const available = fs.readdirSync(path.join(__dirname, 'adapters'))
    .filter((f) => f.endsWith('.js'))
    .map((f) => f.replace(/\.js$/, ''));
  process.stderr.write('Available adapters: ' + available.join(', ') + '\n');
  process.exit(2);
}

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const flags = args.filter((a) => a.startsWith('--'));

if (positional.length < 2) {
  usageError('Missing arguments.');
}

const [adapterKey, containerNumberRaw] = positional;
const containerNumber = containerNumberRaw.trim();

if (!/^[a-z0-9-]+$/.test(adapterKey)) {
  usageError(`Invalid adapter key: ${adapterKey}`);
}

const adapterPath = path.join(__dirname, 'adapters', adapterKey + '.js');
if (!fs.existsSync(adapterPath)) {
  usageError(`Unknown adapter: ${adapterKey}`);
}

const headed = flags.includes('--headed');
const screenshotFlag = flags.find((f) => f.startsWith('--screenshot='));
const screenshotPath = screenshotFlag ? screenshotFlag.split('=').slice(1).join('=') : null;
const timeoutFlag = flags.find((f) => f.startsWith('--timeout='));
const timeoutMs = timeoutFlag ? parseInt(timeoutFlag.split('=')[1], 10) : 90000;

const adapter = require(adapterPath);
const { chromium } = require('playwright');

function output(result) {
  process.stdout.write(JSON.stringify(result) + '\n');
}

(async () => {
  let browser;

  try {
    const launchOptions = {
      headless: !headed,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };

    // Point SCRAPER_CHROMIUM_PATH at a Chromium binary to use it instead of
    // the browsers Playwright downloaded (e.g. a system-provided build).
    if (process.env.SCRAPER_CHROMIUM_PATH) {
      launchOptions.executablePath = process.env.SCRAPER_CHROMIUM_PATH;
    }

    browser = await chromium.launch(launchOptions);

    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      ignoreHTTPSErrors: true,
    });
    context.setDefaultTimeout(timeoutMs);

    const page = await context.newPage();

    const rows = await adapter.track(page, containerNumber);

    if (screenshotPath) {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }

    const cleaned = (rows || [])
      .filter((row) => row && Object.keys(row).length > 0)
      .map((row) => ({ ...row, source: adapter.name }));

    output({ ok: true, adapter: adapterKey, container: containerNumber, rows: cleaned });
    process.exitCode = 0;
  } catch (error) {
    output({ ok: false, adapter: adapterKey, container: containerNumber, error: error.message });
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
})();
