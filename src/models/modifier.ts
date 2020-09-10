import { PokemonEntry, EntryError } from './pokemonEntry';
import { capitalize } from '../util/string';

type ModFn = (
  mon: PokemonEntry,
  usedModName: string, 
  args?: string,
) => PokemonEntry

const LIST_OF_MODIFIERS: Record<string, ModFn> = {
  types(mon, usedModName, args) {
    if (!args) {
      throw new EntryError(
        mon.lineNo,
        `<code>${usedModName}</code> requires arguments. Example: <code>- ${usedModName} Fire/Flying</code>.`
      );
    }

    const types = args.split(/\s*\/\s*/).map(capitalize);
    return { ...mon, types };
  },
  at(mon, usedModName, args) {
    if (!args) {
      throw new EntryError(
        mon.lineNo,
        `<code>${usedModName}</code> requires arguments. Example: <code>- ${usedModName} Route 1, level 5-7, rarity 20%</code>.`
      );
    }

    let [name, levelRange, rarity] = args.split(/\s*,\s*/);
    levelRange = levelRange?.trim()?.replace(/^levels? ?/, '');
    rarity = rarity?.trim()?.replace(/^rarity ?/, '')?.replace(/%$/, '');
    
    if (rarity && !rarity.match(/^\d+$/)) {
      throw new EntryError(
        mon.lineNo,
        `<code>rarity</code> must be an integer percentage.`,
      );
    }

    const locations = mon.locations.concat({ 
      name, 
      levelRange, 
      rarity: rarity ? +rarity : undefined, 
    });

    return { ...mon, locations };
  },
  filler(mon) {
    return { ...mon, isFiller: true };
  },
  noderive(mon) {
    return { ...mon, isNoDerive: true };
  }
}

const ALIASES: Record<string, string> = { 
  type: 'types',
  location: 'at',
  nonderive: 'noderive',
};

export function applyMod(
  usedModName: string,
  args: string | undefined, 
  mon: PokemonEntry
) {
  const modName = (usedModName in ALIASES)
    ? ALIASES[usedModName]
    : usedModName;

  if (modName in LIST_OF_MODIFIERS) {
    const func = LIST_OF_MODIFIERS[modName];
    return func(mon, usedModName, args);
  }

  throw new EntryError(
    mon.lineNo, 
    `Modifier <code>${modName}</code> does not exist.`,
  );
}