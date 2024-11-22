// File: operators/recoverWith.ts
import { Observable, of } from 'rxjs';
import { catchError, retry, retryWhen, delay } from 'rxjs/operators';

// Define a recovery strategy type for handling errors
type RecoveryStrategy = 'retry' | 'retryWithDelay' | 'fallbackValue' | 'fallbackObservable';

/**
 * Custom RxJS operator: recoverWith
 * Allows you to specify a strategy to handle errors from an Observable.
 *
 * @param strategy The recovery strategy to apply ('retry', 'retryWithDelay', 'fallbackValue', 'fallbackObservable')
 * @param config Optional configuration depending on the strategy
 * - For 'retry': provide the number of retries.
 * - For 'retryWithDelay': provide an object with `count` and `delayMs`.
 * - For 'fallbackValue': provide the fallback value.
 * - For 'fallbackObservable': provide an Observable to switch to.
 */
export function recoverWith<T>(
  strategy: RecoveryStrategy,
  config?: number | { count: number; delayMs: number } | T | Observable<T>
) {
  return (source: Observable<T>): Observable<T> => {
    switch (strategy) {
      case 'retry':
        if (typeof config !== 'number') {
          throw new Error('Retry strategy requires a number of retries');
        }
        return source.pipe(retry(config));
      case 'retryWithDelay':
        if (typeof config !== 'object' || config === null || !('count' in config) || !('delayMs' in config)) {
          throw new Error('RetryWithDelay strategy requires an object with `count` and `delayMs` properties');
        }
        return source.pipe(retryWhen(errors => errors.pipe(delay(config.delayMs), retry(config.count))));
      case 'fallbackValue':
        return source.pipe(catchError(() => of(config as T)));
      case 'fallbackObservable':
        if (!(config instanceof Observable)) {
          throw new Error('FallbackObservable strategy requires an Observable');
        }
        return source.pipe(catchError(() => config));
      default:
        throw new Error(`Unknown recovery strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of, throwError } from 'rxjs';
// import { recoverWith } from './src/operators/recoverWith';

// const obs = throwError(() => new Error('Test error'));
// obs.pipe(recoverWith('fallbackValue', 42)).subscribe(console.log);
