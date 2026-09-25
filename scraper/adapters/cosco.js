/**
 * COSCO (elines.coscoshipping.com).
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterCosco).
 * UNVERIFIED against the current site: the selectors date from 2020 and need
 * re-checking against today's markup before this adapter can be trusted.
 */

module.exports = {
  name: 'Cosco',

  async track(page, containerNumber) {
    await page.goto('https://elines.coscoshipping.com/ebusiness/', {
      waitUntil: 'networkidle',
    });

    // Dismiss the announcement modal if one is shown.
    const modalButton = page.locator(
      '.ivu-modal-wrap:not(.ivu-modal-hidden) .ivu-modal-footer .ivu-btn-primary'
    );
    if (await modalButton.count()) {
      await modalButton.first().click().catch(() => {});
    }

    // Switch the search widget to "Container" mode.
    await page.click('div.search_header ul.srh_c_t li:nth-child(3)');
    await page.fill('input.ivu-input', containerNumber);
    await page.click('a.ser_btn');

    await page.waitForSelector('.cntrMovintItem');

    return page.evaluate(() => {
      const record = {};
      const row = document.querySelector('.cntrMovintItem');

      if (!row) {
        return [];
      }

      const elements = [
        { prop: 'type', node: document.querySelector('.cntrInfos span > span') },
        { prop: 'date', node: row.querySelector('.issueTime > p') },
        { prop: 'event', node: row.querySelector('.singleMoving > div:nth-child(2) p.value') },
        { prop: 'place', node: row.querySelector('.singleMoving > div:nth-child(3) p.value') },
      ];

      elements.forEach((el) => {
        if (el.node instanceof Element) {
          record[el.prop] = el.node.textContent.trim();
        }
      });

      return [record];
    });
  },
};
