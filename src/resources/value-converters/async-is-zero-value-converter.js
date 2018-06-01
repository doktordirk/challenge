import { filter} from 'rxjs/operators';

export class AsyncIsZeroValueConverter {
  getPropByPath(obj, keyPath) {
    return keyPath
      .split('.')
      .reduce((prev, curr) => prev[curr], obj);
  }

  toView(stream, options) {
    options = Object.assign({isZero: true}, typeof options === 'boolean' ? {isZero: options} : options);
    return stream.pipe(
      filter(obj => {
        //let tt = ((options.property ? this.getPropByPath(obj, options.property) : obj) === 0) === options.isZero;
        console.log(obj, options, (obj === 0) )
        return (obj === 0);
      })
    );
  }
}
