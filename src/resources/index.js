import {ActionConfirm} from './elements/action-confirm';
import {Checkbox} from './elements/checkbox';

export function configure(config) {
  config.globalResources([
    ActionConfirm,
    Checkbox,
  ]);
}
