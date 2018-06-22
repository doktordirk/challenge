import {inject, Factory, BindingEngine} from 'aurelia-framework';
import {BindingSignaler} from 'aurelia-templating-resources';

import {Person} from '../entities/person';
import {Storage} from '../services/storage';

/**
 * List of all Persons
 * @export
 * @class Persons
 */
@inject(Factory.of(Storage), BindingEngine, BindingSignaler)
export class Persons {
  /**
   * Cache initialized with persons from db
   */
  initialized = false;

  /**
   * internal
   */
  _cache = [];

  /**
   * Storage service
   * @param {Storage}
   * @memberof Persons
   */
  storage;

  /**
   * The last added person
   * @param {Person}
   * @memberof Persons
   */
  lastAdded = null;

  /**
   * The sort directions by attribute
   * @param {{}}
   * @memberof Persons
   */
  sortDirection = {};

  /**
   * Get: Array of all persons from cache. Will load from db if not yet initialized
   * @param {[Person]}
   * @memberof Persons
   */
  get list() {
    if (!this.initialized) {
      return this.loadPersons();
    }

    return this._cache;
  }

  /**
   * Creates an instance of Persons.
   * @param {Storage} StorageFactory
   * @param {BindingEngine} bindingEngine
   * @param {BindingSignaler} bindingSignaler
   * @memberof Persons
   */
  constructor(StorageFactory, bindingEngine, bindingSignaler) {
    this.storage = new StorageFactory('persons');
    this.bindingEngine = bindingEngine;
    this.bindingSignaler = bindingSignaler;

    for (let entry of Person.Schema) {
      if (entry.name !== 'id') {
        this.sortDirection[entry.name] = 1;
      }
    }
  }

  /**
   * Observe person changes and persist if applicable
   * @param {Person} person The person
   * @returns {Person} The person
   * @memberof Persons
   */
  observePerson(person) {
    if (person instanceof Person === false) {
      throw new TypeError('Not of type Person');
    }

    for (let key in person) {
      this.bindingEngine
        .propertyObserver(person, key)
        .subscribe((newValue, oldValue) => this.updatePerson(person));
    }

    return person;
  }

  /**
   * Loads persons from db into cache
   * @returns {[Person]} The loaded persons
   * @memberof Persons
   */
  loadPersons() {
    this.initialized = true;
    this._cache = [];
    let items = this.storage.getItems();

    for (let index in items) {
      let person = new Person(items[index]);
      this.observePerson(person);

      this._cache.push(person);
    }
    this.sort('name');
    this.bindingSignaler.signal('person-list-change');

    return this._cache;
  }

  /**
   * Sort persons by attribute. Optionally, toggles direction setting beforehand
   * @param {string=} undefined: sort by last attribute, string: sort by 'name' or boolean filter attribute
   * @param {boolean=} toggle toggles sort direction beforehand optionally
   * @memberof Persons
   */
  sort(attribute, toggle) {
    if (typeof attribute === 'string') {
      this.lastSort = attribute;
    } else {
      attribute =  this.lastSort;
    }

    if (toggle === true) {
      this.sortDirection[attribute] = this.sortDirection[attribute] === 1 ? -1 : 1;
    }

    if (attribute === 'name') {
      this._cache = this._cache.sort((a, b) => a.name.localeCompare(b.name) * this.sortDirection[attribute]);
    } else {
      this._cache = this._cache.sort((a, b) => (Number(b[attribute]) - Number(a[attribute])) * this.sortDirection[attribute]);
    }
  }

  /**
   * Gives an array of persons by filter from cache
   * @param {string|undefined} filter
   * @returns {[Person]} Array of filtered persons
   * @memberof Persons
   */
  filtered(filter) {
    if (filter !== undefined) {
      return this.list.filter(person => person[filter]);
    }

    return this.list;
  }

  /**
   * Counts persons by filter from cache
   * @param {string|undefined} filter
   * @returns {number} Number of filtered persons
   * @memberof Persons
   */
  count(filter) {
    return this.filtered(filter).length;
  }

  /**
   * Get a person by id from cache
   * @param {number} The id of the person
   * @returns {Person} The removed person
   * @memberof Persons
   */
  getPerson(id) {
    return this.list.find(person => person.id === id);
  }

  /**
   * Add a person to cache and on db
   * @param {{}} The data for the new person
   * @returns {Person} The added person with the inserted id
   * @memberof Persons
   */
  addPerson(person) {
    if (person instanceof Person === false) {
      throw new TypeError('Not of type Person');
    }

    this.storage.addItem(person);
    this.observePerson(person);
    this._cache.push(person);
    this.sort();
    this.bindingSignaler.signal('person-list-change');
    this.lastAdded = person;

    setTimeout(() => {this.lastAdded = null;}, 1500);

    return person;
  }

  /**
   * Removes a person in cache and on db
   * @param {Person} The person to remove
   * @returns {Person} The removed person
   * @memberof Persons
   */
  removePerson(person) {
    if (person instanceof Person === false) {
      throw new TypeError('Must by of type Person');
    }

    this.storage.removeItem(person);
    this._cache = this._cache.filter(h => person.id !== h.id);
    this.bindingSignaler.signal('person-list-change');

    return person;
  }

  /**
   * Updates a person in cache and on db
   * @param {Person} The person to update
   * @returns {Person} The updated person
   * @memberof Persons
   */
  updatePerson(person) {
    if (person instanceof Person === false) {
      throw new TypeError('Must by of type Person');
    }

    this.storage.updateItem(person);
    this._cache = this._cache.map(h => person.id === h.id ? person : h);
    this.sort();
    this.bindingSignaler.signal('person-list-change');

    return person;
  }
}
