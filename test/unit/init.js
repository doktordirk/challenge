import {bootstrap} from 'aurelia-bootstrapper';
import {StandardValidator} from 'aurelia-validation';


//circumvent parser registration issues
StandardValidator.prototype.getMessage = key => key;

export function init(cb, next) {
  return bootstrap(aurelia => {
    aurelia.use
      .plugin(PLATFORM.moduleName('aurelia-validation'));

    return aurelia.start().then(cb);
  }).then(next).catch(next);
}
