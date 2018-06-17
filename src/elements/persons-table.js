import { activationStrategy } from 'aurelia-router';
import { inject, ElementEvents } from 'aurelia-framework';
import { DOM } from 'aurelia-pal';
import { Person } from '../entities/person';
import { Persons } from '../services/persons';
import { Store, connectTo } from 'aurelia-store';
import { pluck, distinctUntilChanged } from 'rxjs/operators';

@inject( Store, Persons )
@connectTo({
  selector: store => store.state.pipe(pluck('sortDirections'), distinctUntilChanged()),
  target: 'sortDirections'
})
export class Overview {
  /**
   * The PersonSchema
   *
   * @param {{}} Schema = Person.Schema
   * @memberof Person
   */
  Schema = Person.Schema;

  /**
   * Stored the person for delete confirmation
   *
   * @param {Person} Person
   * @memberof Person
   */
  doConfirm = {};

  /**
   *Creates an instance of Overview.
   * @param {Persons} persons
   * @memberof Overview
   */
  constructor(store, persons) {
    this.store = store;
    this.persons = persons;
  }

  determineActivationStrategy() {
    return activationStrategy.invokeLifecycle;
  }

  activate(params, routeData, router) {
    this.filter = routeData.name;
    this.store.dispatch('SetFilter', routeData.name);
  }

  attached() {
    this.events = new ElementEvents(DOM);
    this.cancelClickSubscription = this.events.subscribe('click', ev => {
      if (ev.target.id !== 'delete-person') {
        this.doConfirm = false;
      }
    }, false);
  }

  detached() {
    this.cancelClickSubscription.dispose();
  }
}
