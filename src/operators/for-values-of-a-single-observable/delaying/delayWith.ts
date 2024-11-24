// File: operators/delayWith.ts
import { Observable } from 'rxjs';
import { delay, delayWhen } from 'rxjs/operators';

// Define a delay strategy type for controlling the emission timing
type DelayStrategy = 'fixed' | 'dynamic';

/**
 * Custom RxJS operator: delayWith
 * Allows you to specify a strategy to delay the emissions from an Observable.
 *
 * @param strategy The delay strategy to apply ('fixed', 'dynamic')
 * @param config Optional configuration depending on the strategy
 * - For 'fixed': provide the delay duration in milliseconds.
 * - For 'dynamic': provide a function that returns an Observable which determines the delay duration.
 */
export function delayWith<T>(
  strategy: DelayStrategy,
  config: number | ((value: T) => Observable<any>)
) {
  return (source: Observable<T>): Observable<T> => {
    switch (strategy) {
      case 'fixed':
        if (typeof config !== 'number') {
          throw new Error('Fixed delay strategy requires a duration in milliseconds');
        }
        return source.pipe(delay(config));
      case 'dynamic':
        if (typeof config !== 'function') {
          throw new Error('Dynamic delay strategy requires a function returning an Observable');
        }
        return source.pipe(delayWhen(config));
      default:
        throw new Error(`Unknown delay strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of, timer } from 'rxjs';
// import { delayWith } from './src/operators/delayWith';

// const obs = of(1, 2, 3);
// obs.pipe(delayWith('fixed', 1000)).subscribe(console.log);

