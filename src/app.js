import {inject} from 'aurelia-framework';
import {PLATFORM} from 'aurelia-pal';
import {I18N} from 'aurelia-i18n';

import 'font-awesome/css/font-awesome.css';
import './resources/styles.scss';

import {Person} from './entities/person';
import {Persons} from './services/persons';

@inject(Persons, I18N)
export class App {
  title = 'Person management';

  constructor(persons, i18n) {
    this.persons = persons;
    this.i18n = i18n;
    this.locale = this.i18n.getLocale();
  }

  configureRouter(config, router) {
    let routes = [{
      route: ['', 'total'],
      name: 'total',
      title: 'total',
      moduleId: PLATFORM.moduleName('./components/persons-table'),
      nav: true,
    }];

    Person.Schema.map(entry => {
      if (entry.filter) {
        routes.push({
          route: entry.name,
          name: entry.name,
          title: entry.name,
          moduleId: PLATFORM.moduleName('./components/persons-table'),
          nav: true,
        });
      }
    });

    config.map(routes);

    this.router = router;
  }

  setLocale(locale) {
    this.i18n
      .setLocale(locale)
      .then( () => this.locale = locale );
  }
}
