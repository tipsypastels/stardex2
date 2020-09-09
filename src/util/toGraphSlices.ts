import type { Observable } from 'rxjs';
import {  map, groupBy, mergeMap, reduce, toArray, flatMap, withLatestFrom, scan } from 'rxjs/operators';

export default function toGraphSlices<T>() {
  return (source$: Observable<T>) => {
    const groups$ = source$.pipe(
      groupBy(type => type),
      mergeMap(
        (group$) =>
          group$.pipe(
            reduce(
              (acc) => ({ ...acc, count: acc.count + 1 }),
              ({ value: group$.key, count: 0 })
            )
          )
      ),
    );

    const total$ = groups$.pipe(
      scan((acc, group) => acc + group.count, 0),
    );
    
    return groups$.pipe(
      withLatestFrom(total$),
      map(([entry, total]) => ({
        ...entry,
        percent: entry.count / total,
      })),
      toArray(),
      map(result => result.sort((a, b) => b.percent - a.percent))
    );
  }
}