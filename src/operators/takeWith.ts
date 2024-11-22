// File: operators/takeWith.ts
import { Observable } from 'rxjs';
import {  take, skip } from 'rxjs/operators';

// Define a strategy type that determines the behavior of the operator
type TakeStrategy = 'take' | 'skip' | 'first' | 'last';

/**
 * Custom RxJS operator: takeWith
 * Allows you to specify a strategy to take or skip items from an Observable.
 *
 * @param strategy The strategy to apply ('take', 'skip', 'first', 'last')
 * @param count Number of items to take or skip (only for 'take' and 'skip')
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
// of(1, 2, 3, 4, 5).pipe(takeWith('take', 3)).subscribe(console.log);