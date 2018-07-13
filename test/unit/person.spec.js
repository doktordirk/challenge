import {ValidationController} from 'aurelia-validation';
import {init} from './init';
import {Person} from '../../src/entities/person';

const TestSchema = [
  {name: 'id'},
  {name: 'name', required: true},
  {name: 'power', default: false},
];

describe('Person', () => {
  let Schema;

  beforeEach(() => {
    Schema = Person.Schema;
    Person.Schema = TestSchema;
  });

  afterEach(() => {
    Person.Schema = Schema;
  });

  it('constructor() sets properties keys', next => {
    init(aurelia => {
      let data = {id: 0, name: 'foo', power: true};
      let person = new Person(data);

      expect(JSON.stringify(person)).toEqual(JSON.stringify(data));
    }, next);
  });

  it('constructor() sets missing defaults', next => {
    init(aurelia => {
      let person = new Person({name: 'foo'});

      expect(person.power).toBeDefined();
      expect(person.power).toBe(false);
    }, next);
  });

  it('validates true with name set', next => {
    init(aurelia => {
      let controller = aurelia.container.get(ValidationController);
      let person = new Person({name: 'foo'});

      return controller.validate({ object: person }).then(result => {
        expect(result.valid).toBe(true);
      });
    }, next);
  });

  it('validates false with no name set', next => {
    init(aurelia => {
      let controller = aurelia.container.get(ValidationController);
      let person = new Person();

      return controller.validate({ object: person }).then(result => {
        expect(result.valid).toBe(false);
      });
    }, next);
  });
});
