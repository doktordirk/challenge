import { inject, BindingEngine } from 'aurelia-framework';
import { Storage } from './storage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { map, pluck, distinctUntilChanged } from 'rxjs/operators';
import { Person } from '../entities/person';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Store } from 'aurelia-store';

function getAttributeValue(person, attribute) {
  return Boolean(person.attributes.find(attr => attr.name === attribute).value) ? 1 : -1;
}

@inject(Store, BindingEngine)
export class Persons {
  Schema = Person.Schema;
  storage;
  list;
  changedPerson;
  lastAdded;

  constructor(store, bindingEngine) {
    this.store = store;
    this.bindingEngine = bindingEngine;
    this.storage = new Storage('persons-async');
    this.list = new BehaviorSubject(this.storage.getItems());
    this.changedPerson = new Subject();
    this.sortBy = store.state.pipe(pluck('sortBy'), distinctUntilChanged());
    this.filter = store.state.pipe(pluck('filter'), distinctUntilChanged());
    this.sortDirections = store.state.pipe(pluck('sortDirections'), distinctUntilChanged());
    this.filtered = combineLatest(this.list, this.sortBy, this.filter, this.sortDirections)
      .pipe(
        distinctUntilChanged(),
        map(([persons, sortBy, filter, sortDirections]) =>
          persons
            .filter(person => filter === 'total' || getAttributeValue(person, filter) === 1)
            .sort((a, b) => sortBy === 'name' ?
              a.name.localeCompare(b.name) * sortDirections[sortBy] :
              (getAttributeValue(b, sortBy) - getAttributeValue(a, sortBy)) * sortDirections[sortBy])
            .map(person => this.observePerson(person))
        )
      );

    this.allFiltered = combineLatest(this.list, this.filtered).pipe(
      map(([persons, filtered]) => persons.length !== 0 && filtered.length === 0)
    );

    this.hasNoPersons = this.list.pipe(
      map(persons => persons.length === 0)
    );
  }

  observePerson(person) {
    for (let key in person.attributes) {
      this.bindingEngine
        .propertyObserver(person.attributes[key], 'value')
        .subscribe((newValue, oldValue) => this.updatePerson(person));
    }

    return person;
  }

  updatePerson(person) {
    const old = this.storage.getItem(person.id);
    person = this.storage.updateItem(person);
    this.list.next(this.storage.getItems());
    this.changedPerson.next({old, new: person});
  }

  getPersons() {
    this.list.next(this.storage.getItems());
    return this.storage.getItems();
  }

  addPerson(person) {
    person = this.storage.addItem(person);
    this.list.next(this.storage.getItems());
    this.changedPerson.next({old: null, new: person});
    this.lastAdded = person;
    setTimeout(()=>{this.lastAdded =  null;}, 2000);
    return person;
  }

  removePerson(person) {
    this.storage.removeItem(person);
    this.list.next(this.storage.getItems());
    this.changedPerson.next({old: person, new: null});
    return person;
  }

  countAll() {
    return this.list.pipe(
      map(persons => {
        const counts = {total: 0};
        Person.Schema.map(attr => counts[attr.name] = 0);

        persons.map(person => {
          counts.total ++;
          person.attributes.map(attr => {
            if (attr.value) {
              counts[attr.name]++;
            }
          });
        });

        return counts;
      })
    );
  }

  count(attribute) {
    return this.list.pipe(
      map(persons => {
        let count = 0;

        persons.map(person => {
          if (attribute === 'total') count++;
          person.attributes.map(attr => {
            if (attr.name === attribute && attr.value) {
              count++;
            }
          });
        });

        return count;
      })
    );
  }

  sort(attribute, toggle = false) {
    if (toggle) {
      this.store.dispatch('ToggleSortDirection', attribute);
    }

    this.store.dispatch('SetSortBy', attribute);
  }
}
