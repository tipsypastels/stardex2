import { PokemonEntry, EntryError } from './pokemonEntry';
import { capitalize } from '../util/string';

type ModFn = (
  mon: PokemonEntry, 
  args?: string,
) => PokemonEntry

const LIST_OF_MODIFIERS: Record<string, ModFn> = {
  types(mon, args) {
    if (!args) {
      throw new EntryError(
        mon.lineNo,
        `<code>@type</code> requires arguments. Example: <code>@type(Fire/Flying)</code>.`
      );
    }

    const types = args.split(/\//).map(capitalize);
    return { ...mon, types };
  },
  at(mon, args) {
    if (!args) {
      throw new EntryError(
        mon.lineNo,
        `<code>@at</code> requires arguments. Example: <code>@at(Route1, Route2)</code>`
      );
    }

    const locations = args.split(/\s*,\s*/)
                          .map(l => {
                            const [name, levelRange] = l.split(/\s*:\s*/);
                            return { name, levelRange };
                          });

    return { ...mon, locations };
  },
  filler(mon) {
    return { ...mon, isFiller: true };
  },
}

const ALIASES: Record<string, string> = { type: 'types' };

export function applyMod(
  modName: string,
  args: string | undefined, 
  mon: PokemonEntry
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

  throw new EntryError(
    mon.lineNo, 
    `Modifier <code>${modName}</code> does not exist.`,
  );
}