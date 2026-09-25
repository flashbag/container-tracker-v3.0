/**
 * APL (www.apl.com).
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterApl).
 * UNVERIFIED against the current site: the selectors date from 2020 and need
 * re-checking against today's markup before this adapter can be trusted.
 * Note: APL tracking has since been folded into CMA CGM's systems.
 */

module.exports = {
  name: 'APL',

  async track(page, containerNumber) {
    await page.goto('https://www.apl.com/ebusiness/tracking', {
      waitUntil: 'networkidle',
    });

    await page.fill('#Reference', containerNumber);
    await page.click('#btnTracking');

    await page.waitForSelector('.c-endtoend--table table');

    return page.evaluate(() => {
      const table = document.querySelector('.c-endtoend--table table');

      if (!table) {
        return [];
      }

      const cells = table.querySelectorAll('tr[class="is-current is-open"] td');

      if (!cells.length) {
        return [];
      }

      return [{
        type: document.querySelector('.o-container-type').textContent.trim(),
        date: new Date(Date.parse(cells[0].textContent)).toDateString(),
        event: cells[2].textContent.trim(),
        place: cells[3].textContent.trim(),
      }];
    });
  },
};
