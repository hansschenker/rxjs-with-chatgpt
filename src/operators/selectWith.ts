// File: operators/selectWith.ts
import { Observable } from 'rxjs';
import { distinctUntilChanged, takeWhile, skipWhile } from 'rxjs/operators';

// Define a selection strategy type that determines how to select values
type SelectStrategy = 'distinct' | 'takeWhile' | 'skipWhile';

/**
 * Custom RxJS operator: selectWith
 * Allows you to specify a strategy to select values emitted by an Observable.
 *
 * @param strategy The selection strategy to apply ('distinct', 'takeWhile', 'skipWhile')
 * @param predicate Optional predicate function used for 'takeWhile' and 'skipWhile' strategies
 */
export function selectWith<T>(
  strategy: SelectStrategy,
  predicate?: (value: T) => boolean
) {
  return (source: Observable<T>): Observable<T> => {
    switch (strategy) {
      case 'distinct':
        return source.pipe(distinctUntilChanged());
      case 'takeWhile':
        if (typeof predicate !== 'function') {
          throw new Error('TakeWhile strategy requires a predicate function');
        }
        return source.pipe(takeWhile(predicate));
      case 'skipWhile':
        if (typeof predicate !== 'function') {
          throw new Error('SkipWhile strategy requires a predicate function');
        }
        return source.pipe(skipWhile(predicate));
      default:
        throw new Error(`Unknown selection strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of } from 'rxjs';
// import { selectWith } from './src/operators/selectWith';

// const obs = of(1, 2, 3, 4, 5);
// obs.pipe(selectWith('takeWhile', value => value < 4)).subscribe(console.log);

