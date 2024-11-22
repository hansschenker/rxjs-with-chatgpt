// File: operators/takeWith.test.ts
import { of } from 'rxjs';
import { takeWith } from './takeWith';
import { toArray } from 'rxjs/operators';

describe('takeWith Operator', () => {
  it('should take the first 3 values', (done) => {
    const source$ = of(1, 2, 3, 4, 5);
    source$.pipe(takeWith('take', 3), toArray()).subscribe({
      next: (result) => {
        expect(result).toEqual([1, 2, 3]);
      },
      complete: done,
    });
  });

  it('should skip the first 2 values', (done) => {
    const source$ = of(1, 2, 3, 4, 5);
    source$.pipe(takeWith('skip', 2), toArray()).subscribe({
      next: (result) => {
        expect(result).toEqual([3, 4, 5]);
      },
      complete: done,
    });
  });

  it('should take only the first value', (done) => {
    const source$ = of(1, 2, 3, 4, 5);
    source$.pipe(takeWith('first'), toArray()).subscribe({
      next: (result) => {
        expect(result).toEqual([1]);
      },
      complete: done,
    });
  });

  it('should take only the last value', (done) => {
    const source$ = of(1, 2, 3, 4, 5);
    source$.pipe(takeWith('last'), toArray()).subscribe({
      next: (result) => {
        expect(result).toEqual([5]);
      },
      complete: done,
    });
  });
});
