import {Storage} from '../../src/services/storage';

describe('Storage', () => {
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

  it('constructor(key) sets localStorage keys', () => {
    let storage = new Storage('persons');

    expect(storage.key).toBe('storage-data-persons');
  });

  it('getItems() to retrieve and parse items from storage ', () => {
    let storage = new Storage('persons');

    expect(storage.getItems()[0].name).toBe('Bill Gates');
  });

  it('getItem(id) to retrieve the selected item from storage ', () => {
    let storage = new Storage('persons');

    expect(storage.getItem(1).name).toBe('Bill Gates');
  });

  it('updateItem(item) to persist the updated item into storage and return it', () => {
    let storage = new Storage('persons');
    let item = storage.getItem(1);
    item.name = 'some';

    let returnedItem = storage.updateItem(item);
    expect(storage.getItem(1).name).toBe('some');
    expect(returnedItem.id).toBe(item.id);
  });

  it('updateItem(item) return undefined for non existing item.id', () => {
    let storage = new Storage('persons');
    let item = storage.getItem(1);
    item.id = 0;

    expect(storage.updateItem(item)).toBe(undefined);
  });

  it('addItem(item) to persist the updated item into storage and return id with the added id', () => {
    let storage = new Storage('persons');
    let item = {name: 'some'};

    let returnedItem = storage.addItem(item);

    expect(storage.getItem(4).name).toBe('some');
    expect(returnedItem.id).toBe(4);
  });

  it('removeItem(item) to remove the item from storage and return it', () => {
    let storage = new Storage('persons');
    let item = storage.getItem(1);

    let returnedItem = storage.removeItem(item);
    expect(storage.getItem(1)).toBe(undefined);
    expect(returnedItem.id).toBe(item.id);
  });

  it('removeItem(item) return undefined for non existing item.id', () => {
    let storage = new Storage('persons');
    let item = storage.getItem(1);
    item.id = 0;

    expect(storage.removeItem(item)).toBe(undefined);
  });
});
