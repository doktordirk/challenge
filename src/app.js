import {inject} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';
import { Store } from 'aurelia-store';
import 'font-awesome/css/font-awesome.css';
import './resources/styles.scss';

import {Person} from './entities/person';
import {Persons} from './services/persons';
import {setFilter, setSortBy, toggleSortDirection} from './actions';

@inject(Store, Persons)
export class App {
  title = 'Person management';

  constructor(store, persons) {
    store.registerAction('SetFilter', setFilter);
    store.registerAction('SetSortBy', setSortBy);
    store.registerAction('ToggleSortDirection', toggleSortDirection);

    this.persons = persons;
  }

  configureRouter(config, router) {
    let routes = [{
      route: ['', 'total'],
      name: 'total',
      title: 'total',
      moduleId: PLATFORM.moduleName('./elements/persons-table'),
      nav: true
    }];

    Person.Schema.map(entry => {
      if (entry.filter) {
        routes.push({
          route: entry.name,
          name: entry.name,
          title: entry.name,
          moduleId: PLATFORM.moduleName('./elements/persons-table'),
          nav: true
        });
      }
    });

    config.map(routes);

    this.router = router;
  }
}
