import environment from './environment';
import {PLATFORM} from 'aurelia-pal';
import Backend from 'i18next-xhr-backend';
import 'babel-polyfill';
import * as Bluebird from 'bluebird';

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), instance => {
      instance.i18next.use(Backend);

      return instance.setup({
        backend: {
          loadPath: './resources/locale/{{lng}}/{{ns}}.json'
        },
        lng        : 'en',
        attributes : ['t'],
        fallbackLng: 'en',
        debug      : environment.debug,
      });
    })
    .feature(PLATFORM.moduleName('resources/index'));

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
