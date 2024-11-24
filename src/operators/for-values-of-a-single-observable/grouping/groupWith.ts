// File: operators/groupWith.ts
import { Observable, GroupedObservable } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

// Define a grouping strategy type for determining how to group values
type GroupingStrategy = 'byKey';

/**
 * Custom RxJS operator: groupWith
 * Allows you to group values emitted by an Observable based on a specified key.
 *
 * @param strategy The grouping strategy to apply ('byKey')
 * @param keySelector A function that selects the key for each emitted value
 */
export function groupWith<T, K>(
  strategy: GroupingStrategy,
  keySelector: (value: T) => K
) {
  return (source: Observable<T>): Observable<GroupedObservable<K, T>> | Observable<T[]> => {
    switch (strategy) {
      case 'byKey':
        return source.pipe(
          groupBy(keySelector),
          mergeMap(group => group.pipe(toArray()))
        );
      default:
        throw new Error(`Unknown grouping strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of } from 'rxjs';
// import { groupWith } from './src/operators/groupWith';

// const obs = of(
//   { category: 'fruit', name: 'apple' },
//   { category: 'fruit', name: 'banana' },
//   { category: 'vegetable', name: 'carrot' }
// );
// obs.pipe(groupWith('byKey', item => item.category)).subscribe(console.log);
