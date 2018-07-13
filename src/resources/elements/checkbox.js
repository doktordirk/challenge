/**
 * Component Checkbox
 *
 * @usage
 * <person-attribute-checkbox
 *    value.bind="checked"
 *    name="my-attribute"
 *    title="My attribute"
 * </person-attribute-checkbox>
 *
 * @bindable(twoWay) value - the checked status
 * @bindable(oneTime) name - checkbox name for the label
 * @bindable(oneTime) title - if present will display a label
 */
export class Checkbox {
  static $view = {
    template:
      `<template>
        <span class="checkbox">
          <input  id="check-attribute-\${name}"
                  type="checkbox"
                  checked.two-way="value">
          <label if.bind="title" for="check-attribute-\${name}">\${title}</label>
        </span>
      </template>`,
  }

  static $resource() {
    return {
      name: 'checkbox',
      bindables: [
        { name: 'value', defaultBindingMode: 'twoWay' },
        { name: 'name', defaultBindingMode: 'oneTime' },
        { name: 'title', defaultBindingMode: 'oneTime' },
      ],
    };
  }
}
