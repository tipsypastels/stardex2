import type { PokemonEntry } from './pokemonEntry';
import { capitalize } from '../util/string';

type ModFn = (
  mon: Partial<PokemonEntry>, 
  args?: string,
) => Partial<PokemonEntry>

const LIST_OF_MODIFIERS: Record<string, ModFn> = {
  types(mon, args) {
    if (!args) {
      throw new Error(
        `@types requires arguments. Example: @types(Fire/Flying).`
      );
    }

    const types = args.split(/\//).map(capitalize);
    return { ...mon, types };
  },
  filler(mon) {
    return { ...mon, isFiller: true };
  },
}

const ALIASES: Record<string, string> = { type: 'types' };

export function applyMod(
  modName: string,
  args: string | undefined, 
  mon: Partial<PokemonEntry>
) {
  if (modName in ALIASES) {
    modName = ALIASES[modName];
  }

  if (modName in LIST_OF_MODIFIERS) {
    const func = LIST_OF_MODIFIERS[modName];

    if (func.length === 2) {
      return func(mon, args);
    } else {
      return func(mon);
    }
  }

  throw new Error(`Modifier ${modName} does not exist.`);
}