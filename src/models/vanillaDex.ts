import LIST_OF_DEXES from '../data/officialDexes.json';
import LIST_OF_MONS from '../data/mons.json';
import type { PokemonEntry } from './pokemonEntry';

export const vanillaDexes = Object.keys(LIST_OF_DEXES) as VanillaDex[];
export type VanillaDex = keyof typeof LIST_OF_DEXES;

export function dexToAnalytics(dex: VanillaDex): PokemonEntry[] {
  const ids = LIST_OF_DEXES[dex];

  return ids.map((id, i) => {
    const mon = getMonById(id)!;
    return {
      lineNo: i,
      name: mon.name,
      image: mon.image,
      types: mon.types,
      locations: [],
      isFiller: false,
      isIgnored: false,
      isAlt: false,
      isNoDerive: false,
    }
  });
}

const cache = new Map<number, typeof LIST_OF_MONS[number]>();

function getMonById(id: number) {
  if (cache.has(id)) {
    return cache.get(id);
  }

  const mon = LIST_OF_MONS.find(mon => mon.number === id);

  if (!mon) {
    throw new Error(`Builtin Pokemon with id ${id} not found.`);
  }

  cache.set(id, mon);
  return mon;
}