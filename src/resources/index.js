import {PLATFORM} from 'aurelia-pal';

export function configure(config) {
  config.globalResources([PLATFORM.moduleName('./value-converters/async-is-zero-value-converter')]);
}
