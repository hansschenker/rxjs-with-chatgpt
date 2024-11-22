// File: operators/combineWith.ts
import { Observable, combineLatest, zip, merge, forkJoin } from 'rxjs';

// Define a combination strategy type that determines how to combine multiple observables
type CombineStrategy = 'combineLatest' | 'zip' | 'merge' | 'forkJoin';

/**
 * Custom RxJS operator: combineWith
 * Allows you to specify a strategy to combine multiple Observables.
 *
 * @param strategy The strategy to apply ('combineLatest', 'zip', 'merge', 'forkJoin')
 * @param observables An array of observables to combine with the source observable
 */
export function combineWith<T, R>(
  strategy: CombineStrategy,
  ...observables: Observable<R>[]
) {
  return (source: Observable<T>): Observable<any> => {
    switch (strategy) {
      case 'combineLatest':
        return combineLatest([source, ...observables]);
      case 'zip':
        return zip(source, ...observables);
      case 'merge':
        return merge(source, ...observables);
      case 'forkJoin':
        return forkJoin([source, ...observables]);
      default:
        throw new Error(`Unknown combination strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of } from 'rxjs';
// import { combineWith } from './src/operators/combineWith';

// const obs1 = of(1, 2, 3);
// const obs2 = of('a', 'b', 'c');
// obs1.pipe(combineWith('combineLatest', obs2)).subscribe(console.log);
