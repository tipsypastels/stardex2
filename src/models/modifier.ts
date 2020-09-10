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
        `<code>${usedModName}</code> requires arguments. Example: <code>- ${usedModName} Route 1, 5-7</code>.`
      );
    }

    const [name, levelRange] = args.split(/\s*,\s*/);
    const locations = mon.locations.concat({ name, levelRange });
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