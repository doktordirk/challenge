import {inject, NewInstance} from 'aurelia-dependency-injection';
import { I18N } from 'aurelia-i18n';
import { Person } from '../entities/person';
import { Persons } from '../services/persons';
import {ValidationController, validateTrigger} from 'aurelia-validation';

@inject(NewInstance.of(ValidationController), I18N, Persons)
export class AddPerson {
  schema = Person.Schema;
  person;

  constructor(controller, i18n, persons) {
    this.controller = controller;
    this.controller.validateTrigger = validateTrigger.manual;
    this.i18n = i18n;
    this.persons = persons;
    this.reset();
  }

  reset() {
    this.person = new Person();
  }

  add() {
    this.person.name = (this.person.name || '').trim();

    this.controller.validate({ object: this.person })
      .then(result => {
        if (result.valid) {
          this.persons.addPerson(this.person);
          this.reset();
          return;
        }

        setTimeout(() => this.controller.errors = [], 3500);
      });
  }
}
