import type { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export default function mergePluck<T>(key: keyof T) {
  return (source$: Observable<T>) =>
    source$.pipe(mergeMap(v => v[key] as any));
}