import Mod from './mod';
import { capitalize } from '../../util/string';
import { PokemonEntry, EntryError } from '../pokemonEntry';

export const LIST_OF_MODIFIERS: Record<string, Mod<any>> = {
  types: new Mod(
    {
      types: {
        validate: {
          with: /^[A-z0-9_]+(?:\s*\/\s*[A-z0-9_]+)*$/,
          message: 'must be a list of types separated by slashes, such as <code>Fire/Fighting</code>',
        },
      },
    },
    (mon, args) => {
      const types = args.types.split(/\s*\/\s*/).map(capitalize);
      return { ...mon, types };
    }
  ),
  at: new Mod(
    {
      name: {},
      level: {
        isKwarg: true,
        isOptional: true,
        validate: {
          with: /^\d+(?:-\d+)?$/,
          message: 'must be one integer or an integer range, such as <code>1-3</code>',
        },
      },
      rarity: {
        isKwarg: true,
        isOptional: true,
        validate: {
          with: /^\d+%$/,
          message: 'must be an integer percentage',
        },
      },
    },
    (mon, args) => {
      const name = args.name;
      const levelRange = args.level;
      const rarity = args.rarity 
        ? +args.rarity.replace(/%$/, '') 
        : undefined;

      const locations = mon.locations.concat({
        name,
        levelRange,
        rarity,
      });

      return { ...mon, locations };
    },
  ),
  noderive: new Mod(
    {},
    mon => ({ ...mon, isNoDerive: true }),
  ),
  filler: new Mod(
    {},
    mon => ({ ...mon, isFiller: true }),
  ),
  img: new Mod(
    {
      url: {
        validate: {
          with: new RegExp(
            "^" +
            "(?:(?:(?:https?|ftp):)?\\/\\/)" +
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:" +
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
            "(?:" +
            "(?:" +
            "[a-z0-9\\u00a1-\\uffff]" +
            "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
            ")?" +
            "[a-z0-9\\u00a1-\\uffff]\\." +
            ")+" +
            "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
            ")" +
            "(?::\\d{2,5})?" +
            "(?:[/?#]\\S*)?" +
            "$", "i"
          ),
          message: 'must be a valid URL',
        },
      },
    },
    (mon, { url }) => ({ ...mon, image: url }),
  ),
};

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
    return func.call(mon, args!, usedModName);
  }

  throw new EntryError(
    mon.lineNo,
    `Modifier <code>${modName}</code> does not exist.`,
  );
}