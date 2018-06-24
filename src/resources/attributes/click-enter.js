import {PLATFORM} from 'aurelia-framework';

function clickEnterListener(event) {
  if (event.type === 'click' ||
      (event.type === 'keydown' && (event.which === 13 || event.which === 32))) {
    const newEvent = new Event('click-enter', event);
    event.target.dispatchEvent(newEvent);
  }
}

PLATFORM.addEventListener('click', clickEnterListener);
PLATFORM.addEventListener('keydown', clickEnterListener);
