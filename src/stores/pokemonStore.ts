import SvelteSubject from '../util/SvelteSubject';
import { map, catchError, startWith, scan, mergeMap, distinct } from 'rxjs/operators';
import { pokemonEntriesFrom, PokemonEntry } from '../models/pokemonEntry';
import distinctUntilPause from '../util/distinctUntilPause';

export const input = new SvelteSubject('');

export const analytics = input.pipe(
  distinctUntilPause(1000),
  map(pokemonEntriesFrom),
  startWith([] as PokemonEntry[]),
);

export const distinctTypesCount = analytics.pipe(
  // TODO: this doesn't work. how do i get all the entries at the current time
  // without manually using Array#map? 
  map(entries => entries.length),
);