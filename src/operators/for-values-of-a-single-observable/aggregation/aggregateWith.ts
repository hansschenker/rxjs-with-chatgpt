// File: operators/aggregateWith.ts
import { Observable } from 'rxjs';
import { scan, reduce, count } from 'rxjs/operators';

// Define an aggregation strategy type that determines how to aggregate values
type AggregateStrategy = 'scan' | 'reduce' | 'count';

/**
 * Custom RxJS operator: aggregateWith
 * Allows you to specify a strategy to aggregate values from an Observable.
 *
 * @param strategy The aggregation strategy to apply ('scan', 'reduce', 'count')
 * @param accumulator The accumulator function used for 'scan' and 'reduce' strategies
 * @param seed The initial value for the accumulator
 */
export function aggregateWith<T, R>(
  strategy: AggregateStrategy,
  accumulator?: (acc: R, value: T) => R,
  seed?: R
) {
  return (source: Observable<T>): Observable<any> => {
    switch (strategy) {
      case 'scan':
        if (!accumulator || seed === undefined) {
          throw new Error('Accumulator function and seed are required for scan strategy');
        }
        return source.pipe(scan(accumulator, seed));
      case 'reduce':
        if (!accumulator || seed === undefined) {
          throw new Error('Accumulator function and seed are required for reduce strategy');
        }
        return source.pipe(reduce(accumulator, seed));
      case 'count':
        return source.pipe(count());
      default:
        throw new Error(`Unknown aggregation strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of } from 'rxjs';
// import { aggregateWith } from './src/operators/aggregateWith';

// const obs = of(1, 2, 3, 4, 5);
// obs.pipe(aggregateWith('scan', (acc, val) => acc + val, 0)).subscribe(console.log);
