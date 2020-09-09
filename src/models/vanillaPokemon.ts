import LIST_OF_MONS from '../data/mons.json';

export function applyVanillaMon(mon: { name: string }) {
  const entry = getMonEntry(mon.name);

  if (!entry) {
    return mon;
  }

  return { ...entry, ...mon };
}

type Mon = typeof LIST_OF_MONS[number];
const MEMO = new Map<string, Mon>();

function getMonEntry(name: string) {
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