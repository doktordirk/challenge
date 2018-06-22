/**
 * Component InlineConfirm
 *
 * Shows action, question, yes and no slots when clicking on action
 * and calls someAction(handle) on confirmation
 * and cancel-subscriber(eventHandler) on attached for cancellation event handling
 *
 * @usage
 * <inline-confirm
 *     handle.bind="action.id"
 *     action.bind="someAction"
 *     cancel-subscriber.bind="subscriber">
 *  <span slot="action">My action</span>
 *   <span slot="question">Are you sure?</span>
 *   <span slot="yes">Yes</span>
 *   <span slot="no">No</span>
 * </inline-confirm>
 *
 * // example cancel subscriber function of the parent view model:
 *
 * domClickSubscriber = eventHandler => {
 *   this.cancelClickHandle = document.addEventListener('click', eventHandler, false);
 * }
 *
 * @bindable(oneTime) handle - unique handle for this confirmation
 * @bindable(oneTime) action - function which will be called with handle on confirmation. Use arrow function to bind 'this' if needed
 * @bindable(oneTime) cancel-subscriber - subscriber function which will be called on attached with an event handler function for cancellations
 */
export class InlineConfirm {
  static $view = {
    template:
      `<template>
        <span click.trigger="confirmHandle=handle" 
              show.bind="confirmHandle !== handle" 
              class="confirm-action">
          <slot name="action">Action</slot>
        </span>
        <span class="confirm" show.bind="confirmHandle === handle" >
          <span class="confirm-question"><slot name="question">Are you sure?</slot></span>
          <span click.delegate="action(handle)" class="confirm-yes"><slot name="yes">Yes</slot></span>
          <span click.delegate="confirmHandle=undefined" class="confirm-no"><slot name="no">No</slot></span>
        </span>
      </template>`,
  }

  static $resource() {
    return {
      name: 'inline-confirm',
      bindables: [
        { name: 'handle', defaultBindingMode: 'oneTime' },
        { name: 'action', defaultBindingMode: 'oneTime' },
        { name: 'cancel-subscriber', defaultBindingMode: 'oneTime' },
      ],
    };
  }

  /**
   * Stored the handle for current confirmation
   *
   * @param {any} confirmHandle
   * @memberof InlineConfirm
   */
  confirmHandle = undefined;

  attached() {
    const eventHandler = (event) => {
      if (event.target.getAttribute('slot') !== 'action') {
        this.confirmHandle = false;
      }
    };
    this['cancel-subscriber'](eventHandler);
  }
}
