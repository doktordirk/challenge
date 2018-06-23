import { $, $$ } from '../../node_modules/protractor/built/index';

export class PageObjectTable {
  getTable() {
    return $('table');
  }

  getPersonNames() {
    return $$('table tr:not(.aurelia-hide) .name').getText();
  }

  sort(attribute) {
    return $(`table th.header-${attribute}`).click();
  }

  async deletePersonAndConfirm() {
    await $$('table td .delete').first().click();
    await browser.driver.sleep(500);
    return $('table td .confirm .confirm-yes').click();
  }

  async deletePersonAndCancel() {
    await $$('table td .delete').first().click();
    await browser.driver.sleep(500);
    return $('.sidebar h3').click();
  }
}
