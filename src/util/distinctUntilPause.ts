import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, takeUntil, skip } from 'rxjs/operators';

/**
 * Throttles the value until the source observable stops emitting for a
 * given amount of time.
 */
export default function distinctUntilPause<T>(time: number) {
  return (source$: Observable<T>) => 
    source$.pipe(
      debounceTime(time),
      switchMap(value => 
        of(value).pipe(
          takeUntil(
            source$.pipe(skip(1)),
          ),
        ),
      ),
    );
}