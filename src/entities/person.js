import {observable} from 'aurelia-framework';
import {ValidationRules} from 'aurelia-validation';
import PersonSchema from '../config/person-schema';

/**
 * The Person class
 * @export
 * @class Person
 */
export class Person {
  /**
   * The PersonSchema
   *
   * @static {{}} Schema
   * @memberof Person
   */
  static Schema = PersonSchema;

  /**
   * Creates an instance of Person.
   * @param {{}} data object for initialization. Will be checked against Person.Schema
   * @memberof Person
   */
  constructor(data) {
    for (let entry of Person.Schema) {
      observable(this, entry.name);
    }

    if (data) {
      this.set(data);
    }

    ValidationRules
      .ensure('name')
      .required()
      .minLength(3)
      .maxLength(50)
      //.then()
      //.satisfiesRule('nameNotInUse')
      .on(this);
  }

  set(data) {
    for (let entry of Person.Schema) {
      this[entry.name] = data[entry.name];

      if (this[entry.name] === undefined) {
        this[entry.name] = entry.default;
      }
    }
  }
}
