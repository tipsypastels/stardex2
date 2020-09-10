import LIST_OF_MONS from '../data/mons.json';
import { findBestMatch } from 'string-similarity';
import type { PokemonEntry } from './pokemonEntry';

type Mon = typeof LIST_OF_MONS[number];
type MonsByName = Readonly<Record<Mon['name'], Mon>>;

export const vanillaMonsByName = LIST_OF_MONS.reduce<MonsByName>(
  (acc, mon) => ({ ...acc, [mon.name.toLowerCase()]: mon }),
  {},
);

export const vanillaMonNames = Object.keys(vanillaMonsByName);

export function applyVanillaMon(_entry: PokemonEntry) {
  if (_entry.isNoDerive) {
    return _entry;
  }
  
  const vanillaMon = vanillaMonsByName[_entry.name.toLowerCase()];

  if (!vanillaMon) {
    return _entry;
  }

  const entry = { ..._entry };

  if (!entry.types.length) {
    entry.types = vanillaMon.types;
  }
  
  if (!entry.image) {
    entry.image = vanillaMon.image;
  }
  
  return entry;
}

export function didYouMeanVanillaMon({ name, isNoDerive }: PokemonEntry) {
  if (isNoDerive) {
    return;
  }

  const result = findBestMatch(name.toLowerCase(), vanillaMonNames);

  if (result.bestMatch.rating > 0.8) {
    return vanillaMonsByName[result.bestMatch.target].name;
  }
}

// TODO: decide how nidoran works in the source json
export function normalizeVanillaName(name: string) {
  return name.replace(/^Flabebe$/i, 'Flabébé')
             .replace(/^Type ?Null$/i, 'Type: Null')
             .replace(/^Ho ?Oh$/i, 'Ho-Oh')
             .replace(/^Mr ?Mime$/i, 'Mr. Mime')
             .replace(/^Mime ?Jr$/i, 'Mime Jr.')
             .replace(/^Jangmo ?o$/i, 'Jangmo-o')
             .replace(/^Hakamo ?o$/i, 'Hakamo-o')
             .replace(/^Kommo ?o$/i, 'Kommo-o')
}