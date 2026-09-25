/**
 * Maersk (www.maersk.com).
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterMaersk).
 * UNVERIFIED against the current site: the selectors date from 2020 and need
 * re-checking against today's markup before this adapter can be trusted.
 */

module.exports = {
  name: 'Maersk',

  async track(page, containerNumber) {
    await page.goto('https://www.maersk.com', { waitUntil: 'networkidle' });

    // Accept the cookie banner if its API is present.
    await page
      .evaluate(() => {
        if (typeof CookieInformation !== 'undefined') {
          CookieInformation.submitAllCategories();
        }
      })
      .catch(() => {});

    await page.click('button[data-id="header-track"]');
    await page.fill('#ign-trackingNumber', containerNumber);
    await page.click('button.ign-button--primary');

    await page.waitForSelector('.pt-results');

    return page.evaluate(() => {
      const record = {};
      const table = document.querySelector('table.expandable-table__wrapper');

      if (!table) {
        return [];
      }

      const typeSpans = table.querySelectorAll('td[data-th="Container type size"] > span');
      const dateSpans = table.querySelectorAll('td[data-th="Arrival date and time"] > span');
      const placeSpans = table.querySelectorAll('td[data-th="Last location"] > span');

      if (typeSpans.length) {
        record.type = typeSpans[typeSpans.length - 1].textContent;
      }

      if (dateSpans.length) {
        const dateParts = dateSpans[dateSpans.length - 1].innerHTML.split('<br>');
        if (dateParts.length) {
          record.date = new Date(Date.parse(dateParts[0])).toDateString();
        }
      }

      if (placeSpans.length) {
        const placeParts = placeSpans[placeSpans.length - 1].innerHTML.split('<br>');
        if (placeParts.length) {
          const placeParts2 = placeParts[0].split('•');
          if (placeParts2.length === 2) {
            record.event = placeParts2[0].trim();
            record.place = placeParts2[1].trim();
          }
        }
      }

      return [record];
    });
  },
};
