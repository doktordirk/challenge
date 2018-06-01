/**
 * The Storage class
 * Retrieves and persists items in localStorage
 * @export
 * @class Storage
 */
export class Storage {
  /**
   * Base key for localStorage
   *
   * @static
   * @memberof Storage
   */
  static baseKey = 'storage-data';

  /**
   * Key for localStorage
   * @memberof Storage
   */
  key;

  /**
   * Creates an instance of Storage.
   * @param {string} extension The key extension for this storage instance
   * @memberof Storage
   */
  constructor(extension) {
    this.key = `${Storage.baseKey}-${extension}`;
  }

  /**
   * Get an item by id from storage
   * @param {number} id
   * @returns {{id: number, any}} The item
   * @memberof Storage
   */
  getItem(id) {
    return this::getData().items.find(i => i.id === id);
  }

  /**
   * Gets items from storage
   * @returns {[{id: number, any}] The items
   * @memberof Storage
   */
  getItems() {
    return this::getData().items;
  }

  /**
   * Update an item and persist in storage
   * @param {{id: number, any}} item The item
   * @returns {{id: number, any}} The updated item
   * @memberof Storage
   */
  updateItem(item) {
    let {items, count} = this::getData();
    let updatedItem;

    items = items.map(i => {
      if (i.id === item.id) {
        updatedItem = Object.assign(i, item);
        return updatedItem;
      }

      return i;
    });

    this::setData({items, count});

    return updatedItem;
  }

  /**
   * Persist a new item in storage
   * @param {{id: number, any}} item The item
   * @returns {{id: number, any}} The persisted item with the new id set
   * @memberof Storage
   */
  addItem(item) {
    let {items, count} = this::getData();

    item.id = count + 1;
    items.push(item);

    this::setData({items, count: item.id});

    return item;
  }

  /**
   * Removes an item from storage
   * @param {{id: number, any} item The item
   * @returns {{id: number, any}} The removed item or undefined if not found
   * @memberof Storage
   */
  removeItem(item) {
    let deletedItem;
    let {items, count} = this::getData();

    items = items.filter(i => {
      if (i.id === item.id) {
        deletedItem = i;
        return false;
      }
      return true;
    });

    this::setData({items, count});

    return deletedItem;
  }
}

function setData({items, count}) {
  localStorage.setItem(this.key, JSON.stringify({items, count}));
}

function getData() {
  return JSON.parse(localStorage.getItem(this.key)) || {items: [], count: 0};
}
