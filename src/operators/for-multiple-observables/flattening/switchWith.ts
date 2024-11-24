// File: operators/switchWith.ts
import { Observable } from 'rxjs';
import { switchMap, exhaustMap, concatMap, mergeMap } from 'rxjs/operators';

// Define a switching strategy type for determining how to switch between observables
type SwitchStrategy = 'switchMap' | 'concatMap' | 'mergeMap' | 'exhaustMap';

/**
 * Custom RxJS operator: switchWith
 * Allows you to specify a strategy to switch between inner Observables.
 *
 * @param strategy The switching strategy to apply ('switchMap', 'concatMap', 'mergeMap', 'exhaustMap')
 * @param project A function that returns an inner Observable based on the source value
 */
export function switchWith<T, R>(
  strategy: SwitchStrategy,
  project: (value: T) => Observable<R>
) {
  return (source: Observable<T>): Observable<R> => {
    switch (strategy) {
      case 'switchMap':
        return source.pipe(switchMap(project));
      case 'concatMap':
        return source.pipe(concatMap(project));
      case 'mergeMap':
        return source.pipe(mergeMap(project));
      case 'exhaustMap':
        return source.pipe(exhaustMap(project));
      default:
        throw new Error(`Unknown switching strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of, interval } from 'rxjs';
// import { switchWith } from './src/operators/switchWith';

// const obs = of(1, 2, 3);
// obs.pipe(switchWith('switchMap', value => interval(1000).pipe(map(i => i + value)))).subscribe(console.log);

