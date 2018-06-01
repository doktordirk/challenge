import { $ } from '../../node_modules/protractor/built/index';

export class PageObjectRouter {
  navigateTo(route) {
    $(`.router a[href="#/${route}"]`).click();
  }
}
