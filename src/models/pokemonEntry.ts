import { applyMod } from './modifier';
import { applyVanillaMon } from './vanillaPokemon';

export type PokemonEntry = {
  lineNo: number;
  name: string;
  image: string;
  types: string[];
  locations: string[];
  isFiller: boolean;
  isIgnored: boolean;
  isAlt: boolean;
}

export class EntryError extends Error {
  line: number;

  constructor(line: number, message: string) {
    super(message);
    this.line = line;
  }
}

export function pokemonEntriesFrom(text: string) {
  const lines = text.split(/\n/);
  const entries: PokemonEntry[] = [];
  let buffer: string[] = [];

  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const line = lines[lineNo].trim();

    if (!line) {
      buffer = [];
      continue;
    }

    if (line.startsWith('#')) {
      continue;
    }

    if (line.startsWith('[')) {
      buffer = line.slice(1).replace(/\]$/, '').split(/@/);
      continue;
    }

    let [name, ...mods] = line.split(/@/).map(s => s.trim());
    let entry = makeEntry(name, lineNo);

    if (buffer.length) {
      mods = buffer.concat(...mods).filter(x => !!x);
    }

    for (const mod of mods) {
      const match = /([a-z]+)(?:\((.*?)\))?/g.exec(mod)
      
      if (!match) {
        throw new EntryError(
          lineNo, 
          `Invalid usage of modifier <code>${mod}</code>`,
        );
      }

      const [, modName, modArgs] = match;
      entry = applyMod(modName, modArgs, entry);
    }

    entry = applyVanillaMon(entry);

    if (!entry.types?.length) {
      throw new EntryError(
        lineNo,
        `Unknown Pokémon: <code>${name}</code>. If this is a custom Pokémon, explicitly list its types as <code>${name} @type(Type1/Type2)</code>`
      );
    }

    entries.push(entry as PokemonEntry);
  }

  return entries;
}

const DEFAULT_IMAGE = 'https://github.com/tipsypastels/pokemonSprites/blob/master/gen5/0.png';

function makeEntry(name: string, lineNo: number): PokemonEntry {
  return {
    lineNo,
    name,
    image: DEFAULT_IMAGE,
    types: [],
    locations: [],
    isFiller: false,
    isAlt: false,
    isIgnored: false,
  }
}