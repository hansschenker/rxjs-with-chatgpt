// File: operators/mergeWith.ts
import { Observable, merge, concat, race } from 'rxjs';

// Define a merging strategy type that determines how to merge multiple observables
type MergeStrategy = 'merge' | 'concat' | 'race';

/**
 * Custom RxJS operator: mergeWith
 * Allows you to specify a strategy to merge the source Observable with additional Observables.
 *
 * @param strategy The merging strategy to apply ('merge', 'concat', 'race')
 * @param observables Additional Observables to merge with the source Observable
 */
export function mergeWith<T>(
  strategy: MergeStrategy,
  ...observables: Observable<T>[]
) {
  return (source: Observable<T>): Observable<T> => {
    switch (strategy) {
      case 'merge':
        return merge(source, ...observables);
      case 'concat':
        return concat(source, ...observables);
      case 'race':
        return race(source, ...observables);
      default:
        throw new Error(`Unknown merging strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of } from 'rxjs';
// import { mergeWith } from './src/operators/mergeWith';

// const obs1 = of(1, 2, 3);
// const obs2 = of(4, 5, 6);
// obs1.pipe(mergeWith('merge', obs2)).subscribe(console.log);

