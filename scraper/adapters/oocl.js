/**
 * OOCL (www.oocl.com). Results open in a popup window.
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterOocl).
 * UNVERIFIED against the current site: the selectors date from 2020 and need
 * re-checking against today's markup before this adapter can be trusted.
 */

module.exports = {
  name: 'OOCL',

  async track(page, containerNumber) {
    await page.goto(
      'https://www.oocl.com/eng/ourservices/eservices/cargotracking/Pages/cargotracking.aspx',
      { waitUntil: 'networkidle' }
    );

    await page.waitForSelector('#cargoTrackingDropBtn');

    await page
      .evaluate(() => {
        if (typeof acceptCookiePolicy === 'function') {
          acceptCookiePolicy();
        }
      })
      .catch(() => {});

    // Switch the search mode dropdown to "Container".
    await page.click('#cargoTrackingDropBtn');
    await page.click('#cargoTrackingDropBtn .dropdown-menu.inner li[data-original-index="2"] a');

    await page.fill('#SEARCH_NUMBER', containerNumber);

    // The search opens the results in a popup window.
    const [popup] = await Promise.all([
      page.context().waitForEvent('page'),
      page.click('#container_btn'),
    ]);

    await popup.waitForSelector('table.groupTable');

    return popup.evaluate(() => {
      const record = {};
      const table = document.querySelector('table.groupTable');

      if (!table) {
        return [];
      }

      const row = table.querySelectorAll('tr[class]')[0];

      if (!row) {
        return [];
      }

      const cells = row.querySelectorAll('td');

      if (!cells.length) {
        return [];
      }

      const elements = [
        { prop: 'date', node: cells[7] },
        { prop: 'event', node: cells[5] },
        { prop: 'place', node: cells[6] },
      ];

      elements.forEach((el) => {
        if (el.node instanceof Element) {
          if (el.prop === 'date') {
            record[el.prop] = new Date(Date.parse(el.node.textContent.split(',')[0])).toDateString();
          } else {
            record[el.prop] = el.node.textContent.replace(/(\t|\n)/g, '').trim();
          }
        }
      });

      return [record];
    });
  },
};
