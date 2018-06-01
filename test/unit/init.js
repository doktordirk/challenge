import {bootstrap} from 'aurelia-bootstrapper';
import {StandardValidator} from 'aurelia-validation';


//circumvent parser registration issues
StandardValidator.prototype.getMessage = key => key;

export function init(cb) {
  bootstrap(aurelia => {
    aurelia.use
      .plugin(PLATFORM.moduleName('aurelia-validation'));

    aurelia.start().then(cb);
  });
}
