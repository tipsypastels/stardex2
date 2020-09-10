import SvelteSubject from '../util/SvelteSubject';
import { 
  map, 
  flatMap, 
  mergeAll, 
  distinct, 
  startWith,
  pluck,
  switchMap,
  filter,
  toArray,
  groupBy,
  catchError,
  mapTo,
  mergeMap,
  reduce,
} from 'rxjs/operators';
import { pokemonEntriesFrom, PokemonEntry } from '../models/pokemonEntry';
import distinctUntilPause from '../util/distinctUntilPause';
import { from, of, pipe, EMPTY } from 'rxjs';
import currentCount from '../util/currentCount';
import toGraphSlices from '../util/toGraphSlices';
import storeLocally from '../util/storeLocally';

const KEY = 'stardex2-entries';

function getInitialValue() {
  return localStorage.getItem(KEY) ?? '';
}

export const input = new SvelteSubject(getInitialValue());

export const inputAutosave = input.pipe(
  storeLocally(KEY),
);

export const inputErrors = input.pipe(
  distinctUntilPause(750),
  flatMap(value => 
    of(value).pipe(
      map(pokemonEntriesFrom),
      mapTo(null), // we don't need the value
      catchError(e => of(e)),
    )  
  ),
  startWith(null),
);

export const analytics = input.pipe(
  flatMap(value => 
    of(value).pipe(
      map(pokemonEntriesFrom),
      catchError(() => EMPTY),
    )  
  ),
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

export const locationsCount = analytics.pipe(
  switchMap(entries => {
    if (entries.length) {
      return from(entries).pipe(
        pluck('locations'),
        mergeAll(),
        distinct(),
        currentCount(),
      )
    }

    return of(0);
  }),
  startWith(0),
)

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

export const locationDistribution = analytics.pipe(
  flatMap(entries =>
    from(entries).pipe(
      flatMap(entry => 
        from(entry.locations).pipe(
          map(location => ({ 
            location: location.name, 
            entry: { 
              ...entry, 
              levelRange: location.levelRange, 
            }, 
          }))
        )  
      ),
      groupBy(p => p.location, p => p.entry),
      mergeMap(group$ => 
        group$.pipe(
          reduce(
            (acc, entry) => ({ ...acc, entries: [...acc.entries, entry]}),
            ({ location: group$.key, entries: [] as PokemonEntry[] }),
          )
        )  
      ),
      toArray(),
      map(array => 
        array.sort((a, b) => 
          a.location.localeCompare(b.location),
        ),
      ),
    ),
  ),
);

export const locationUnsetEntries = analytics.pipe(
  flatMap(entries =>
    from(entries).pipe(
      filter(entry => entry.locations.length === 0),
      toArray(),
    ),
  ),
);