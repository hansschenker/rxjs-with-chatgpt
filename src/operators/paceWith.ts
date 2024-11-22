// File: operators/paceWith.ts
import { Observable } from 'rxjs';
import { throttleTime, debounceTime, auditTime, sampleTime } from 'rxjs/operators';

// Define a pacing strategy type that determines how to control the rate of emissions
type PaceStrategy = 'throttle' | 'debounce' | 'audit' | 'sample';

/**
 * Custom RxJS operator: paceWith
 * Allows you to specify a strategy to control the rate of emissions from an Observable.
 *
 * @param strategy The pacing strategy to apply ('throttle', 'debounce', 'audit', 'sample')
 * @param duration The duration in milliseconds to use for the pacing strategy
 */
export function paceWith<T>(
  strategy: PaceStrategy,
  duration: number
) {
  return (source: Observable<T>): Observable<T> => {
    switch (strategy) {
      case 'throttle':
        return source.pipe(throttleTime(duration));
      case 'debounce':
        return source.pipe(debounceTime(duration));
      case 'audit':
        return source.pipe(auditTime(duration));
      case 'sample':
        return source.pipe(sampleTime(duration));
      default:
        throw new Error(`Unknown pacing strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of, interval } from 'rxjs';
// import { paceWith } from './src/operators/paceWith';

// const obs = interval(100);
// obs.pipe(paceWith('throttle', 500)).subscribe(console.log);

