import {Person} from '../entities/person';

let sortDirections = { name: 1 };
Person.Schema.map(attr => {
  if (attr.filter) {
    sortDirections[attr.name] = 1;
  }
});

export const initialState = {
  filter: 'total',
  sortBy: 'name',
  sortDirections
};
