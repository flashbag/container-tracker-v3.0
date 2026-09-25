/**
 * MSC (www.msc.com).
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterMsc).
 * UNVERIFIED against the current site: the selectors (including the WebForms
 * postback) date from 2020 and need re-checking against today's markup before
 * this adapter can be trusted.
 */

module.exports = {
  name: 'MSC',

  async track(page, containerNumber) {
    await page.goto('https://www.msc.com/track-a-shipment?link=68987f15-a8b0-44d2-99c8-d62bdf59c921', {
      waitUntil: 'networkidle',
    });

    // Dismiss the country-detection and cookie prompts if shown.
    await page.click('.countryDetectSelection', { timeout: 10000 }).catch(() => {});
    await page.click('.button-secondary', { timeout: 10000 }).catch(() => {});

    await page.fill(
      '#ctl00_ctl00_plcMain_plcMain_TrackSearch_txtBolSearch_TextField',
      containerNumber
    );

    await page.evaluate(() => {
      WebForm_DoPostBackWithOptions(
        new WebForm_PostBackOptions(
          'ctl00$ctl00$plcMain$plcMain$TrackSearch$hlkSearch',
          '',
          true,
          'BolSearchPage',
          '',
          false,
          true
        )
      );
    });

    await page.waitForSelector('table.resultTable');

    return page.evaluate(() => {
      const record = {};
      const tableStats = document.querySelector('table.containerStats');
      const tableResults = document.querySelector('table.resultTable');

      if (tableStats instanceof Element) {
        tableStats.querySelectorAll('tr').forEach((row, indexRow) => {
          if (indexRow !== 1) return;

          row.querySelectorAll('td').forEach((cell, indexCell) => {
            if (indexCell === 0) {
              record.type = cell.textContent.trim();
            }
          });
        });
      }

      if (tableResults instanceof Element) {
        tableResults.querySelectorAll('tr').forEach((row, indexRow) => {
          if (indexRow !== 1) return;

          row.querySelectorAll('td').forEach((cell, indexCell) => {
            if (indexCell === 0) {
              record.place = cell.textContent.trim();
            }
            if (indexCell === 1) {
              record.event = cell.textContent.trim();
            }
            if (indexCell === 2) {
              record.date = new Date(Date.parse(cell.textContent)).toDateString();
            }
          });
        });
      }

      return [record];
    });
  },
};
