import {ActionConfirm} from './elements/action-confirm';
import {Checkbox} from './elements/checkbox';

// add click-enter event binding functionality
import './attributes/click-enter';

export function configure(config) {
  config.globalResources([
    ActionConfirm,
    Checkbox,
  ]);
}
