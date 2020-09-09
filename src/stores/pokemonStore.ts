import SvelteSubject from '../util/SvelteSubject';
import { map, catchError, startWith, scan, mergeMap, distinct, mergeAll, flatMap, mergeScan } from 'rxjs/operators';
import { pokemonEntriesFrom, PokemonEntry } from '../models/pokemonEntry';
import distinctUntilPause from '../util/distinctUntilPause';
import { of } from 'rxjs';

export const input = new SvelteSubject('');

export const analytics = input.pipe(
  distinctUntilPause(1000),
  map(pokemonEntriesFrom),
  startWith([] as PokemonEntry[]),
);

export const distinctTypesCount = analytics.pipe(
  map(entries => 
    of(entries).pipe(
      mergeAll(),
      map(entries => entries.types),
      mergeAll(),
      distinct(),
      scan(count => count + 1, 0),
    ),
  ),
  flatMap(value => value),
  startWith(0),
);