import { inject, BindingEngine } from 'aurelia-framework';
import { Storage } from './storage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators';
import { Person } from '../entities/person';
import { combineLatest } from 'rxjs/observable/combineLatest';


function getAttributeValue(person, attribute) {
  return person.attributes.find(attr => attr.name === attribute).value;
}

@inject(BindingEngine)
export class Persons {
  Schema = Person.Schema;
  storage;
  list;
  changedPerson;
  filter = 'total';
  sortDirection = {};

  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
    this.storage = new Storage('persons');
    this.list = new BehaviorSubject(this.storage.getItems());
    this.changedPerson = new Subject();

    this.sortDirection.name = 1;
    this.Schema.map(attr => this.sortDirection[attr.name] = 1);
    this.sortBy = new BehaviorSubject({attribute: 'name', dir: 1});
    this.filter = new BehaviorSubject('total');

    this.filtered = combineLatest(this.list, this.sortBy, this.filter).pipe(
      map(([persons, sortBy, filter]) =>
        persons
          .filter(person => filter === 'total' || getAttributeValue(person, filter))
          .sort((a, b) =>
            sortBy.attribute === 'name' ?
              a.name.localeCompare(b.name) * sortBy.dir :
              (Number(getAttributeValue(b, sortBy.attribute)) - Number(getAttributeValue(a, sortBy.attribute))) * sortBy.dir
          )
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
    const item = this.storage.addItem(person);
    this.list.next(this.storage.getItems());
    this.changedPerson.next({old: null, new: person});
    return item;
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
      this.sortDirection[attribute] = this.sortDirection[attribute] === 1 ? -1 : 1;
    }

    this.sortBy.next({attribute, dir: this.sortDirection[attribute]});
  }
}
