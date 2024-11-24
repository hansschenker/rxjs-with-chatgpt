// File: operators/filterWith.ts
import { Observable } from 'rxjs';
import { filter, first, last } from 'rxjs/operators';

// Define a filtering strategy type that determines how to filter values
type FilterStrategy = 'filter' | 'first' | 'last';

/**
 * Custom RxJS operator: filterWith
 * Allows you to specify a strategy to filter the values emitted by an Observable.
 *
 * @param strategy The filtering strategy to apply ('filter', 'first', 'last')
 * @param predicate Optional predicate function used for the 'filter' strategy
 */
export function filterWith<T>(
  strategy: FilterStrategy,
  predicate?: (value: T) => boolean
) {
  return (source: Observable<T>): Observable<T> => {
    switch (strategy) {
      case 'filter':
        if (typeof predicate !== 'function') {
          throw new Error('Filter strategy requires a predicate function');
        }
        return source.pipe(filter(predicate));
      case 'first':
        return source.pipe(first());
      case 'last':
        return source.pipe(last());
      default:
        throw new Error(`Unknown filtering strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of } from 'rxjs';
// import { filterWith } from './src/operators/filterWith';

// const obs = of(1, 2, 3, 4, 5);
// obs.pipe(filterWith('filter', value => value > 3)).subscribe(console.log);
