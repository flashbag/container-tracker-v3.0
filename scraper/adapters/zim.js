/**
 * ZIM (www.zim.com).
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterZim).
 * UNVERIFIED against the current site: the selectors date from 2020 and need
 * re-checking against today's markup before this adapter can be trusted.
 */

module.exports = {
  name: 'Zim',

  async track(page, containerNumber) {
    await page.goto('https://www.zim.com/tools/track-a-shipment', {
      waitUntil: 'networkidle',
    });

    await page.click('button.accept-cookies-button').catch(() => {});

    await page.fill('#ConsNumber', containerNumber);
    await page.click('input.track-shipment-button');

    await page.waitForSelector('table.track-shipment');

    return page.evaluate(() => {
      const table = document.querySelector('table.track-shipment');

      if (!table) {
        return [];
      }

      const cells = table.querySelectorAll('tr:last-child > td');

      if (!cells.length) {
        return [];
      }

      return [{
        type: document.querySelector('dl.dl-inline:not(.lg) dd').textContent.trim(),
        date: new Date(Date.parse(cells[3].textContent)).toDateString(),
        event: cells[1].textContent.trim(),
        place: cells[2].textContent.trim(),
      }];
    });
  },
};
