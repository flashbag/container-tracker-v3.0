/**
 * Yang Ming (www.yangming.com).
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterYangMing).
 * UNVERIFIED against the current site: the selectors date from 2020 and need
 * re-checking against today's markup before this adapter can be trusted.
 */

module.exports = {
  name: 'Yang Ming',

  async track(page, containerNumber) {
    await page.goto(
      'https://www.yangming.com/e-service/track_trace/track_trace_cargo_tracking.aspx',
      { waitUntil: 'networkidle' }
    );

    await page.fill('#ContentPlaceHolder1_num1', containerNumber);
    await page.click('#ContentPlaceHolder1_btnTrack');

    await page.waitForSelector('#ContentPlaceHolder1_gvCargoTracking tbody tr');

    return page.evaluate(() => {
      const rows = document.querySelectorAll('#ContentPlaceHolder1_gvCargoTracking tbody tr');
      const data = [];

      rows.forEach((row) => {
        const record = {};

        row.querySelectorAll('td').forEach((cell, key) => {
          switch (key) {
            case 1:
              record.size = cell.textContent.trim();
              break;
            case 2:
              record.type = cell.textContent.trim();
              break;
            case 3:
              record.datetime = cell.textContent.trim();
              break;
            case 4:
              record.event = cell.textContent.trim();
              break;
            case 5:
              record.place = cell.textContent.trim();
              break;
          }
        });

        data.push(record);
      });

      return data;
    });
  },
};
