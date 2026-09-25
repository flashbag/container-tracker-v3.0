/**
 * Hamburg Süd (www.hamburgsud-line.com).
 *
 * Ported from the 2020 puphpeteer adapter (App\Models\Adapters\ParseAdapterHamburgSud).
 * WIP even in the original: the search flow was implemented but the result
 * extraction never was (the original returned no rows). Hamburg Süd has since
 * been absorbed into Maersk, so this adapter likely wants retiring rather
 * than finishing.
 */

module.exports = {
  name: 'Hamburg Sud',

  async track(page, containerNumber) {
    await page.goto('https://www.hamburgsud-line.com/linerportal/pages/hsdg/tnt.xhtml?lang=en', {
      waitUntil: 'networkidle',
    });

    await page.fill('form textarea', containerNumber);
    await page.click('form button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // TODO: result extraction was never implemented; needs a valid container
    // number and current markup to write.
    return [];
  },
};
