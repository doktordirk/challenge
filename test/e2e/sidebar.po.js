import { $ } from '../../node_modules/protractor/built/index';

export class PageObjectSidebar {
  getTitle() {
    return $('.sidebar h3').getText();
  }

  getSidebar() {
    return $('.sidebar');
  }

  getTotalFromFirstLink() {
    return $('.sidebar a').getText();
  }

  getAttributeCountFromLink(attribute) {
    return $(`.sidebar a[href="#/${attribute}"]`).getText();
  }
}
