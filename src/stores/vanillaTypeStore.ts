import SvelteSubject from '../util/SvelteSubject';
import { dexToAnalytics, VanillaDex } from '../models/vanillaDex';
import { 
  map, 
  mergeAll, 
  mergeMap, 
  pluck, 
  reduce, 
  startWith,
  switchMap, 
} from 'rxjs/operators';
import { from, iif, of } from 'rxjs';
import toGraphSlices from '../util/toGraphSlices';

export const selectedVanillaDexes = new SvelteSubject<VanillaDex[]>([]);
export const selectedDexesAverageAnalytics = selectedVanillaDexes.pipe(
  switchMap(regions =>
    iif(() => regions.length === 0,
      of([]),
      of(regions).pipe(
        mergeMap(regions =>
          from(regions).pipe(
            map(dexToAnalytics),
            reduce((acc, cur) => [...acc, ...cur])
          ),
        ),
        mergeMap(entries =>
          from(entries).pipe(
            pluck('types'),
            mergeAll(),
            toGraphSlices(),
            startWith([]),
          ),
        ),
      ),
    ),
  ),
);