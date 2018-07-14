import {delayedTest} from './helpers';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {PLATFORM, DOM} from 'aurelia-pal';

describe('Checkbox', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('resources/elements/checkbox'))
      .inView('<checkbox value.bind="value" name.bind="name" title.bind="title"></checkbox>');
  });

  it('should create input and label with value and id', () => {
    let model = { value: true, title: 'title', name: 'name' };
    return component
      .boundTo(model)
      .create(bootstrap).then(() => {
        const input = document.querySelector('input');
        const label = document.querySelector('label');
        expect(input.id).toBe('check-attribute-name');
        expect(label.getAttribute('for')).toBe('check-attribute-name');
        expect(input.checked).toBe(true);
        expect(label.innerText).toBe('title');
      });
  });

  it('should create input with value and id and w/o label ', () => {
    let model = { value: false, name: 'name' };
    return component
      .boundTo(model)
      .create(bootstrap).then(() => {
        const input = document.querySelector('input');
        const label = document.querySelector('label');
        expect(input.id).toBe('check-attribute-name');
        expect(label).toBe(null);
        expect(input.checked).toBe(false);
      });
  });

  it('should create input and change value', () => {
    let model = { value: false, name: 'name' };
    return component
      .boundTo(model)
      .create(bootstrap).then(() => {
        const input = document.querySelector('input');
        const label = document.querySelector('label');
        expect(input.id).toBe('check-attribute-name');
        expect(label).toBe(null);
        expect(input.checked).toBe(false);

        input.checked = true;
        input.dispatchEvent(DOM.createCustomEvent('change'));

        return delayedTest( () => {
          expect(model.value).toBe(true);
        }, 1);
      });
  });

  afterEach(() => {
    component.dispose();
  });
});
