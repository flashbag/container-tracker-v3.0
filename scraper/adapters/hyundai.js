/**
 * Hyundai Merchant Marine / HMM (www.hmm21.com). Results open in a popup.
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterHyundai).
 * WIP even in the original: the search flow was implemented but the result
 * extraction never was (the original evaluated an empty script).
 */

module.exports = {
  name: 'Hyundai',

  async track(page, containerNumber) {
    await page.goto('https://www.hmm21.com/cms/company/engn/index.jsp', {
      waitUntil: 'networkidle',
    });

    // The site opens an ad popup on load; close it if it appears.
    const context = page.context();
    for (const openPage of context.pages()) {
      if (openPage !== page) {
        await openPage.close().catch(() => {});
      }
    }

    await page.selectOption('select[name="type"]', '2');
    await page.fill('input[name="number"]', containerNumber);

    // The search opens the results in a popup window.
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      page.click('table[summary="ButtonPanelTable"] button'),
    ]);

    await popup.waitForLoadState('networkidle');

    // TODO: result extraction was never implemented; needs a valid container
    // number and current markup to write.
    return [];
  },
};
