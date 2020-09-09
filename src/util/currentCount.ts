import type { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

/**
 * Like RXJS's `count`, but doesn't wait for the observable to complete
 * before returning the value.
 */
export default function currentCount<T>() {
  return (source$: Observable<T>) =>
    source$.pipe(scan(count => count + 1, 0));
}