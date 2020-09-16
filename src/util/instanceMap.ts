import { iif, Observable, ObservableInput, of } from 'rxjs';
import { mergeMap, switchMap } from 'rxjs/operators';

export default function instanceMap<T, R>(mapper: (val: T[]) => ObservableInput<R[]>) {
  return (source$: Observable<T[]>) =>
    source$.pipe(
      switchMap(values =>
        iif(() => values.length === 0,
          of([] as R[]),
          of(values).pipe(mergeMap(mapper)),
        )
      )
    )
}