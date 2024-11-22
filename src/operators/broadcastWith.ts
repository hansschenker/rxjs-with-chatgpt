// File: operators/broadcastWith.ts
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';
import { multicast, publish, share } from 'rxjs/operators';

// Define a broadcasting strategy type that determines how to share the observable
type BroadcastStrategy = 'multicast' | 'publish' | 'publishBehavior' | 'publishReplay' | 'share';

/**
 * Custom RxJS operator: broadcastWith
 * Allows you to specify a strategy to share an Observable with multiple subscribers.
 *
 * @param strategy The broadcasting strategy to apply ('multicast', 'publish', 'publishBehavior', 'publishReplay', 'share')
 * @param subjectFactory Optional subject factory for multicast strategy
 */
export function broadcastWith<T>(
  strategy: BroadcastStrategy,
  subjectFactory?: () => Subject<T>
) {
  return (source: Observable<T>): Observable<T> => {
    switch (strategy) {
      case 'multicast':
        if (!subjectFactory) {
          throw new Error('Subject factory is required for multicast strategy');
        }
        return source.pipe(multicast(subjectFactory()));
      case 'publish':
        return source.pipe(publish());
      case 'publishBehavior':
        return source.pipe(publish(new BehaviorSubject<T>(null as any)));
      case 'publishReplay':
        return source.pipe(publish(new ReplaySubject<T>()));
      case 'share':
        return source.pipe(share());
      default:
        throw new Error(`Unknown broadcasting strategy: ${strategy}`);
    }
  };
}

// Example usage:
// import { of } from 'rxjs';
// import { broadcastWith } from './src/operators/broadcastWith';

// const obs = of(1, 2, 3);
// obs.pipe(broadcastWith('share')).subscribe(console.log);

