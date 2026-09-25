/**
 * Hapag-Lloyd (www.hapag-lloyd.com).
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterHapagLloyd).
 * WIP even in the original: the search flow was implemented but the result
 * extraction never was (the original returned no rows).
 */

module.exports = {
  name: 'Hapag Lloyd',

  async track(page, containerNumber) {
    await page.goto(
      'https://www.hapag-lloyd.com/en/online-business/tracing/tracing-by-container.html',
      { waitUntil: 'networkidle' }
    );

    await page.click('#accept-recommended-btn-handler').catch(() => {});

    await page.fill('table[summary="LabelledComponentTable"] input', containerNumber);
    await page.click('table[summary="ButtonPanelTable"] button');

    await page.waitForSelector('#statusInfo');

    // TODO: result extraction was never implemented; needs a valid container
    // number and current markup to write.
    return [];
  },
};
