// File: operators/transformWith.ts
import { Observable } from 'rxjs';
import { map, mapTo, pluck } from 'rxjs/operators';

// Define a transformation strategy type that determines how to transform values
type TransformStrategy = 'map' | 'mapTo' | 'pluck';

/**
 * Custom RxJS operator: transformWith
 * Allows you to specify a strategy to transform the values emitted by an Observable.
 *
 * @param strategy The transformation strategy to apply ('map', 'mapTo', 'pluck')
 * @param transformArg Optional argument used for the transformation strategy
 * - For 'map': provide a mapping function.
 * - For 'mapTo': provide a value to map every emission to.
 * - For 'pluck': provide the key to pluck from the emitted object.
 */
export function transformWith<T, R>(
  strategy: TransformStrategy,
  transformArg?: ((value: T) => R) | R | string
) {
  return (source: Observable<T>): Observable<any> => {
    switch (strategy) {
      case 'map':
        if (typeof transformArg !== 'function') {
          throw new Error('Map strategy requires a mapping function');
        }
        return source.pipe(map(transformArg as (value: T) => R));
      case 'mapTo':
        if (transformArg === undefined) {
          throw new Error('MapTo strategy requires a value to map to');
        }
        return source.pipe(mapTo(transformArg));
      case 'pluck':
        if (typeof transformArg !== 'string') {
          throw new Error('Pluck strategy requires a key to pluck from the emitted object');
        }
        return source.pipe(pluck(transformArg));
      default:
        throw new Error(`Unknown transformation strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of } from 'rxjs';
// import { transformWith } from './src/operators/transformWith';

// const obs = of({ name: 'Alice' }, { name: 'Bob' });
// obs.pipe(transformWith('pluck', 'name')).subscribe(console.log);
