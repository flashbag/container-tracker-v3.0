/**
 * CMA CGM (www.cma-cgm.com).
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterCmaCgm).
 * UNVERIFIED against the current site: the selectors date from 2020 and need
 * re-checking against today's markup before this adapter can be trusted.
 */

module.exports = {
  name: 'CMA CGM',

  async track(page, containerNumber) {
    await page.goto('https://www.cma-cgm.com', { waitUntil: 'networkidle' });

    await page.click('a[href="#track"]');
    await page.fill('#track-number', containerNumber);

    // The tracking form is the third submit button on the page.
    await page.evaluate(() => {
      document.querySelectorAll('button[type="submit"]')[2].click();
    });

    await page.waitForSelector('table');

    return page.evaluate(() => {
      const record = {};
      const table = document.querySelector('table');

      if (!table) {
        return [];
      }

      const typeElement = document.querySelector('abbr[class="o-container-type"]');
      if (typeElement) {
        record.type = typeElement.textContent;
      }

      table.querySelectorAll('tr').forEach((row, indexRow) => {
        if (indexRow !== 1) return;

        row.querySelectorAll('td').forEach((cell, indexCell) => {
          if (indexCell === 0) {
            record.date = new Date(Date.parse(cell.textContent)).toDateString();
          }
          if (indexCell === 2) {
            record.event = cell.textContent.trim();
          }
          if (indexCell === 3) {
            record.place = cell.textContent.trim();
          }
        });
      });

      return [record];
    });
  },
};
