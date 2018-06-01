import {inject} from 'aurelia-framework';
import {Persons} from '../services/persons';
import {Person} from '../entities/person';

@inject(Persons)
export class Statistics {
  personsStats;

  constructor(persons) {
    this.persons = persons;
    this.attributes = Person.Schema.filter(entry => entry.filter);
  }
}
