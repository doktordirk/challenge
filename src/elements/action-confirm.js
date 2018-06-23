/**
 * Component InlineConfirm
 *
 * Clickable action with with confirmation
 * Calls someAction(handle) on confirmation
 * Calls cancel-subscriber(eventHandler) on attached for cancellation event handling
 *
 * @usage
 * <action-confirm
 *     action.bind="someAction"
 *     handle.bind="action.id"
 *     cancel-subscriber.bind="subscriber">
 *  <span slot="action">My action</span>
 *   <span slot="question">Are you sure?</span>
 *   <span slot="yes">Yes</span>
 *   <span slot="no">No</span>
 * </action-confirm>
 *
 * // example cancel-subscriber function of the parent view model:
 *
 * domClickSubscriber = eventHandler => {
 *   this.cancelClickHandle = document.addEventListener('click', eventHandler, false);
 * }
 *
 * @bindable(oneTime) action - function which will be called with handle on confirmation. Use arrow function to bind 'this' if needed
 * @bindable(oneTime) handle - unique handle for this confirmation
 * @bindable(oneTime) cancel-subscriber - subscriber function which will be called on attached with an event handler function for cancellations
 */
export class ActionConfirm {
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
      name: 'action-confirm',
      bindables: [
        { name: 'action', defaultBindingMode: 'oneTime' },
        { name: 'handle', defaultBindingMode: 'oneTime' },
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