import SvelteSubject from '../util/SvelteSubject';
import { 
  map, 
  flatMap, 
  mergeAll, 
  distinct, 
  startWith,
  pluck,
  tap,
  switchMap,
  filter,
  toArray,
} from 'rxjs/operators';
import { pokemonEntriesFrom, PokemonEntry } from '../models/pokemonEntry';
import distinctUntilPause from '../util/distinctUntilPause';
import { from, of } from 'rxjs';
import currentCount from '../util/currentCount';
import toGraphSlices from '../util/toGraphSlices';

const KEY = 'stardex2-entries';

function getInitialValue() {
  return localStorage.getItem(KEY) ?? '';
}

export const input = new SvelteSubject(getInitialValue());

export const inputAutosave = input.pipe(
  tap(input => localStorage.setItem(KEY, input)),
);

export const analytics = input.pipe(
  distinctUntilPause(1000),
  map(pokemonEntriesFrom),
  startWith([] as PokemonEntry[]),
);

export const pokemonCount = analytics.pipe(
  pluck('length'), 
);

export const typesCount = analytics.pipe(
  switchMap(entries => {
    if (entries?.length) {
      return from(entries).pipe(
        pluck('types'),
        mergeAll(),
        distinct(),
        currentCount(),
      );
    }

    return of(0);
  }),
  startWith(0),
);

export const fillersCount = analytics.pipe(
  flatMap(entries =>
    from(entries).pipe(
      filter(e => !!e.isFiller),
      toArray(),
      pluck('length'),
    ),
  ),
);

export const typeDistribution = analytics.pipe(
  flatMap(entries => 
    from(entries).pipe(
      pluck('types'),
      mergeAll(),
      toGraphSlices(),
      startWith([]),
    ),
  ),
);