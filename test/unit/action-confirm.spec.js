import {delayedTest} from './helpers';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {PLATFORM, DOM} from 'aurelia-pal';

describe('Checkbox', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('resources/elements/action-confirm'))
      .inView(`<div>
        <action-confirm
            action.bind="someAction"
            handle="id"
            cancel-subscriber.bind="subscriber">
          <span slot="action">My action</span>
          <span slot="question">Sure?</span>
          <span slot="yes">Yup</span>
          <span slot="no">Na</span>
        </action-confirm></div>`);
  });

  it('should create and display action and hide confirm', () => {
    let someAction = () => {};
    let subscriber = () => {};
    let model = { someAction: someAction, id: 'id', 'subscriber': subscriber };
    return component
      .boundTo(model)
      .create(bootstrap).then(() => {
        const actionSpan = document.querySelector('.confirm-action');
        const confirmSpan = document.querySelector('.confirm');
        expect(actionSpan.className).not.toContain('aurelia-hide');
        expect(confirmSpan.className).toContain('aurelia-hide');
        expect(actionSpan.innerText.trim()).toBe('My action');
      });
  });

  it('should onclick hide action and show confirm', () => {
    let someAction = () => {};
    let subscriber = () => {};
    let model = { someAction: someAction, id: 'id', 'subscriber': subscriber };
    return component
      .boundTo(model)
      .create(bootstrap).then(() => {
        const actionSpan = document.querySelector('.confirm-action');
        const confirmSpan = document.querySelector('.confirm');
        const confirmQuestionSpan = document.querySelector('.confirm-question');
        const confirmYesSpan = document.querySelector('.confirm-yes');
        const confirmNoSpan = document.querySelector('.confirm-no');

        actionSpan.dispatchEvent(new Event('click-enter', { bubbles: true }));
        return delayedTest( () => {
          expect(actionSpan.className).toContain('aurelia-hide');
          expect(confirmSpan.className).not.toContain('aurelia-hide');
          expect(confirmQuestionSpan.innerText.trim()).toBe('Sure?');
          expect(confirmYesSpan.innerText.trim()).toBe('Yup');
          expect(confirmNoSpan.innerText.trim()).toBe('Na');
        }, 1);
      });
  });

  afterEach(() => {
    component.dispose();
  });
});
