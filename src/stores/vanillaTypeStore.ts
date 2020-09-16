import SvelteSubject from '../util/SvelteSubject';
import { dexToAnalytics, VanillaDex } from '../models/vanillaDex';
import { 
  concatAll,
  defaultIfEmpty,
  map, 
  mergeMap, 
  reduce, 
  startWith,
  switchMap, 
} from 'rxjs/operators';
import { from, iif, of } from 'rxjs';
import toGraphSlices from '../util/toGraphSlices';
import mergePluck from '../util/mergePluck';
import instanceMap from '../util/instanceMap';

export const selectedVanillaDexes = new SvelteSubject<VanillaDex[]>([]);

export const selectedDexesAverageAnalytics = selectedVanillaDexes.pipe(
  instanceMap(regions => 
    from(regions).pipe(
      map(dexToAnalytics),
      reduce((a, b) => a.concat(...b)),
      mergeMap(entries => 
        from(entries).pipe(
          mergePluck('types'),
          toGraphSlices(),
        ),
      ),
    ),
  ),
);