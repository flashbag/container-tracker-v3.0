/**
 * K-Line (via ecomm.one-line.com — K-Line's container business is now ONE).
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterKLine).
 * UNVERIFIED against the current site: the selectors date from 2020 and need
 * re-checking against today's markup before this adapter can be trusted.
 */

module.exports = {
  name: 'K-LINE',

  async track(page, containerNumber) {
    await page.goto('http://ecomm.one-line.com/ecom/CUP_HOM_3301.do?redir=Y&sessLocale=en', {
      waitUntil: 'networkidle',
    });

    await page.selectOption('#searchType', 'C');
    await page.fill('#searchName', containerNumber);
    await page.click('#btnSearch');

    await page.waitForSelector('#detailInfo > table');

    return page.evaluate(() => {
      const record = {};
      const table = document.querySelector('#detailInfo > table');

      if (!table) {
        return [];
      }

      const cells = table.querySelectorAll('tr:last-child > td');

      if (!cells.length) {
        return [];
      }

      const elements = [
        { prop: 'type', node: document.getElementById('st_cntrTpszNm') },
        { prop: 'date', node: cells[3] },
        { prop: 'event', node: cells[1] },
        { prop: 'place', node: cells[2] },
      ];

      elements.forEach((el) => {
        if (el.node instanceof Element) {
          if (el.prop === 'type') {
            record[el.prop] = el.node.innerHTML.split('<br>')[1];
          } else if (el.prop === 'date') {
            record[el.prop] = new Date(Date.parse(el.node.textContent)).toDateString();
          } else {
            record[el.prop] = el.node.textContent.trim();
          }
        }
      });

      return [record];
    });
  },
};
