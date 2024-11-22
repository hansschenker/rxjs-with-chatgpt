// File: operators/takeWith.ts
import { Observable } from 'rxjs';
import { take, skip } from 'rxjs/operators';

// Define a strategy type that determines the behavior of the operator
type TakeStrategy = 'take' | 'skip' | 'first' | 'last';

/**
 * Custom RxJS operator: takeWith
 * Allows you to specify a strategy to take or skip items from an Observable.
 *
 * @param strategy The strategy to apply ('take', 'skip', 'first', 'last')
 * @param count Number of items to take or skip (only applicable for 'take' and 'skip')
 * @returns A new Observable that emits values based on the specified strategy
 *
 * ## Example
 * ```typescript
 * import { of } from 'rxjs';
 * import { takeWith } from './src/operators/takeWith';
 *
 * const obs = of(1, 2, 3, 4, 5);
 * // Example using 'take'
 * obs.pipe(takeWith('take', 3)).subscribe(console.log); // Output: 1, 2, 3
 *
 * // Example using 'first'
 * obs.pipe(takeWith('first')).subscribe(console.log); // Output: 1
 * ```
 *
 * In the above example, `takeWith` allows you to take or skip items from the source Observable using various strategies like 'take', 'skip', 'first', or 'last'.
 */
export function takeWith<T>(strategy: TakeStrategy, count: number = 1) {
  return (source: Observable<T>): Observable<T> => {
    switch (strategy) {
      case 'take':
        return source.pipe(take(count));
      case 'skip':
        return source.pipe(skip(count));
      case 'first':
        return source.pipe(take(1));
      case 'last':
        // Note: 'last' requires buffering all values
        return new Observable<T>((subscriber) => {
          const values: T[] = [];
          source.subscribe({
            next(value) {
              values.push(value);
            },
            error(err) {
              subscriber.error(err);
            },
            complete() {
              if (values.length > 0) {
                subscriber.next(values[values.length - 1]);
              }
              subscriber.complete();
            },
          });
        });
      default:
        throw new Error(`Unknown strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of } from 'rxjs';
// import { takeWith } from './src/operators/takeWith';

// const obs = of(1, 2, 3, 4, 5);
// obs.pipe(takeWith('take', 3)).subscribe(console.log);
