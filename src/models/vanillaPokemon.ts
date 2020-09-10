import LIST_OF_MONS from '../data/mons.json';
import type { PokemonEntry } from './pokemonEntry';

export function applyVanillaMon(_entry: PokemonEntry) {
  const vanillaMon = getVanillaMon(_entry.name);

  if (!vanillaMon) {
    return _entry;
  }

  const entry = { ..._entry };

  if (!entry.types.length) {
    entry.types = vanillaMon.types;
  }
  
  entry.image = vanillaMon.image;
  return entry;
}

type Mon = typeof LIST_OF_MONS[number];
const MEMO = new Map<string, Mon>();

function getVanillaMon(name: string) {
  return upsert(MEMO, name, searchForMon);
}

function searchForMon(name: string) {
  return LIST_OF_MONS.find(m => m.name === name);
}

function upsert<K, V>(
  map: Map<K, V>, 
  key: K, 
  getValue: (key: K, map: Map<K, V>) => V
): V {
  if (map.has(key)) {
    return map.get(key)!;
  }

  const value = getValue(key, map);
  map.set(key, value);
  return value;
}