export const setFilter = (state, filter) => Object.assign({}, state, {filter});

export const setSortBy = (state, sortBy) => Object.assign({}, state, {sortBy});

export const toggleSortDirection = (state, attribute) => {
  const newSortDirections = Object.assign({}, state.sortDirections);
  newSortDirections[attribute] = newSortDirections[attribute] === 1 ? -1 : 1;
  return Object.assign({}, state, {sortDirections: newSortDirections});
};
