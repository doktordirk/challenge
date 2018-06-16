import environment from './environment';
import {PLATFORM} from 'aurelia-pal';
import Backend from 'i18next-xhr-backend';

import {initialState} from './config/state';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-async-binding'))
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), instance => {
      instance.i18next.use(Backend);

      return instance.setup({
        backend: {
          loadPath: './resources/locale/{{lng}}/{{ns}}.json'
        },
        lng: 'en',
        attributes: ['t'],
        fallbackLng: 'en',
        debug: environment.debug
      });
    })
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-store'), { initialState });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
