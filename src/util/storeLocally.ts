import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export default function storeLocally<T>(key: string) {
  return (source$: Observable<T>) => 
    source$.pipe(
      tap((value) => localStorage.setItem(key, `${value}`)),
    );
}