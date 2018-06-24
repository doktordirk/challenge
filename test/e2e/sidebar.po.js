import { $ } from '../../node_modules/protractor/built/index';

export class PageObjectSidebar {
  getTitle() {
    return $('.sidebar h2').getText();
  }

  getSidebar() {
    return $('.sidebar');
  }

  getTotalFromFirstLink() {
    return $('.sidebar a .count-number').getText();
  }

  getAttributeCountFromLink(attribute) {
    return $(`.sidebar a[href="#/${attribute}"] .count-number`).getText();
  }
}
