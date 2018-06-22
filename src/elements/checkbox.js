/**
 * Component Checkbox
 *
 * @usage
 * <person-attribute-checkbox
 *    value.bind="checked"
 *    name="my-attribute"
 *    title="My attribute"
 *    aria="My attribute">
 * </person-attribute-checkbox>
 *
 * @bindable(twoWay) value - the checked status
 * @bindable(oneTime) name - checkbox name for the label
 * @bindable(oneTime) title - if present will display a label
 * @bindable(oneTime) aria - the checkbox's aria-label, falls back to 'title'
 */
export class Checkbox {
  static $view = {
    template:
      `<template>
        <div class="checkbox">
          <input  name="check-attribute-\${name}"
                  type="checkbox"
                  aria-label="\${aria || title || name}" 
                  checked.two-way="value">
          <label if.bind="title" for="check-attribute-\${name}">\${title}</label>
        </div>
      </template>`,
  }

  static $resource() {
    return {
      name: 'checkbox',
      bindables: [
        { name: 'value', defaultBindingMode: 'twoWay' },
        { name: 'name', defaultBindingMode: 'oneTime' },
        { name: 'title', defaultBindingMode: 'oneTime' },
        { name: 'aria', defaultBindingMode: 'oneTime' },
      ],
    };
  }
}
