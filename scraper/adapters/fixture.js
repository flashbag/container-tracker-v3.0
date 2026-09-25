/**
 * Hermetic test adapter: drives a local HTML page that mimics a carrier
 * tracking flow (type container number, submit, results rendered by JS).
 * Used by the PHP feature tests to prove the PHP -> Node -> browser -> JSON
 * pipeline without touching any real carrier site.
 */

const path = require('path');

module.exports = {
  name: 'Fixture',

  async track(page, containerNumber) {
    const url = 'file://' + path.join(__dirname, '..', 'fixtures', 'tracking.html');
    await page.goto(url);

    await page.fill('#tracking-number', containerNumber);
    await page.click('#track-button');
    await page.waitForSelector('#results tbody tr');

    return page.$$eval('#results tbody tr', (trs) =>
      trs.map((tr) => ({
        container: tr.querySelector('.cell-container').textContent.trim(),
        type: tr.querySelector('.cell-type').textContent.trim(),
        date: tr.querySelector('.cell-date').textContent.trim(),
        event: tr.querySelector('.cell-event').textContent.trim(),
        place: tr.querySelector('.cell-place').textContent.trim(),
      }))
    );
  },
};
