import {delayedTest} from './helpers';
import {init} from './init';
import {Persons} from '../../src/services/persons';
import {Person} from '../../src/entities/person';
import {Storage} from '../../src/services/storage';

describe('Persons', () => {
  beforeEach(()=>{
    localStorage.setItem('storage-data-persons', JSON.stringify({
      items: [
        {id: 1, name: 'Bill Gates',      power: false, rich: true,  genius: true},
        {id: 2, name: 'Bruce Willis',    power: true,  rich: true,  genius: false},
        {id: 3, name: 'Albert Einstein', power: true,  rich: false, genius: true},
      ],
      count: 3,
    }));
  });

  it('constructor(typeof Storage) connects to db', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      expect(persons.storage instanceof Storage).toBe(true);
    });
  });

  it('observePerson(person) throw if not of type Person', () => {
    return init(aurelia => {
      let person = {name: 'foo'};
      let persons = aurelia.container.get(Persons);

      let error = ()  => persons.observePerson(person);

      expect(error).toThrowError(TypeError, 'Not of type Person');
    });
  });

  it('observePerson(person) adds observes and persists if applicable', () => {
    return init(aurelia => {
      let person = new Person({name: 'foo'});
      let persons = aurelia.container.get(Persons);
      spyOn(persons.storage, 'updateItem');

      let returnedPerson = persons.observePerson(person);

      expect(returnedPerson).toBe(person);

      returnedPerson.name = 'bar';

      return delayedTest( () => {
        expect(persons.storage.updateItem).toHaveBeenCalledWith(person);
      }, 1);
    });
  });

  it('sort(attribute: string) sorts persons', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      persons._cache = [{id: 1, name: 'foo'}, {id: 2, name: 'bar'}];

      persons.sortDirection.name = 1;
      persons.sort('name');

      expect(persons._cache[0].name).toBe('bar');
      expect(persons.sortDirection.name).toBe(1);
    });
  });

  it('sort(attribute: string, true) to toggle direction and sorts persons', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      persons._cache = [{id: 1, name: 'foo'}, {id: 2, name: 'bar'}];
      persons.sortDirection.name = 1;
      persons.sort('name', true);

      expect(persons._cache[0].name).toBe('foo');
      expect(persons.sortDirection.name).toBe(-1);
    });
  });

  it('sort(attribute: boolean) sorts persons', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      persons._cache = [{id: 1, rich: true}, {id: 2, rich: false}];
      persons.sortDirection.rich = 1;
      persons.sort('rich');

      expect(persons._cache[0].rich).toBe(true);
      expect(persons.sortDirection.rich).toBe(1);
    });
  });

  it('sort(attribute: boolean, true) to toggle direction and sorts persons', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      persons._cache = [{id: 1, rich: true}, {id: 2, rich: false}];
      persons.sortDirection.rich = 1;
      persons.sort('rich', true);

      expect(persons._cache[0].rich).toBe(false);
      expect(persons.sortDirection.rich).toBe(-1);
    });
  });

  it('loadPersons() loads from db and returns full list', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      persons._cache = [{id: 1, name: 'foo'}];

      let PersonsList = persons.loadPersons();

      expect(persons.initialized).toBe(true);
      expect(PersonsList.length).toBe(3);
      expect(PersonsList.filter(person => person.name === 'foo').length).toBe(0);
    });
  });

  it('list if not initialized, loads from db and returns full list', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      spyOn(persons, 'loadPersons').and.callThrough();

      let PersonsList = persons.list;

      expect(persons.initialized).toBe(true);
      expect(persons.loadPersons).toHaveBeenCalled();
      expect(PersonsList.length).toBe(3);
    });
  });

  it('list if initialized, not to load from db and just returns full list', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      persons.loadPersons();

      spyOn(persons, 'loadPersons').and.callThrough();

      let PersonsList = persons.list;

      expect(persons.loadPersons).not.toHaveBeenCalled();
      expect(PersonsList.length).toBe(3);
    });
  });

  it('filtered() returns full list', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);

      expect(persons.filtered().length).toBe(3);
    });
  });

  it('filtered(filter) returns filtered list', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);

      expect(persons.filtered('power').length).toBe(2);
    });
  });

  it('count() counts items', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);

      expect(persons.count()).toBe(3);
    });
  });

  it('count(filter) counts items matching filter', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);

      expect(persons.count('power')).toBe(2);
    });
  });

  it('getPerson(id) gets a person by id', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      persons._cache = [{id: 1, name: 'foo'}];
      persons.initialized = true;

      let person = persons.getPerson(1);

      expect(person.id).toBe(1);
      expect(person.name).toBe('foo');
    });
  });

  it('addPerson(data) adds a person with data and persists', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      persons.loadPersons();

      let person = new Person({name: 'foo'});
      let returnedPerson = persons.addPerson(person);

      expect(persons.count()).toBe(4);
      expect(persons.getPerson(4)).toBe(returnedPerson);
      expect(returnedPerson.id).toBe(4);
      expect(returnedPerson.name).toBe('foo');

      persons.loadPersons();
      expect(persons.count()).toBe(4);
    });
  });

  it('addPerson(person) throw if not of type Person', () => {
    return init(aurelia => {
      let person = {name: 'foo'};
      let persons = aurelia.container.get(Persons);

      let error = ()  => persons.addPerson(person);

      expect(error).toThrowError(TypeError, 'Not of type Person');
    });
  });

  it('removePerson(person) removes a person and persists', () => {
    return init(aurelia => {
      let persons = aurelia.container.get(Persons);
      persons.loadPersons();
      let person = persons.list[0];
      let returnedPerson = persons.removePerson(person);

      expect(persons.count()).toBe(2);
      expect(persons.getPerson(person.id)).toBeUndefined();
      expect(returnedPerson).toBe(person);

      persons.loadPersons();

      expect(persons.count()).toBe(2);
      expect(persons.getPerson(person.id)).toBeUndefined();
    });
  });

  it('removePerson(person) throw if not of type Person', () => {
    return init(aurelia => {
      let person = {name: 'foo'};
      let persons = aurelia.container.get(Persons);

      let error = ()  => persons.removePerson(person);

      expect(error).toThrowError(TypeError, 'Not of type Person');
    });
  });

  it('updatePerson(person) throw if not of type Person', () => {
    return init(aurelia => {
      let person = {name: 'foo'};
      let persons = aurelia.container.get(Persons);

      let error = ()  => persons.updatePerson(person);

      expect(error).toThrowError(TypeError, 'Not of type Person');
    });
  });
});
