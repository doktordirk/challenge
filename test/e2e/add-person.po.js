export class PageObjectAddPerson {
  getTitle() {
    return $('add-person h3').getText();
  }

  async addPerson(name, attributes) {
    if (name) {
      element(by.name('add-person-name')).sendKeys(name);
      await browser.driver.sleep(200);
    }

    for (const attr in attributes) {
      if (attributes[attr]) element(by.name(`add-person-${attr}`)).click();
      await browser.driver.sleep(200);
    }

    element(by.name('add-person-submit')).click();
  }

  getError() {
    return $('add-person .alert').getText();
  }
}
