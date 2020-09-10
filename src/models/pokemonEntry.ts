import { applyMod } from './modifier';
import { applyVanillaMon } from './vanillaPokemon';
import { splitOnFirst } from '../util/string';

export type PokemonEntry = {
  lineNo: number;
  name: string;
  image: string;
  types: string[];
  locations: LocationEntry[];
  isFiller: boolean;
  isIgnored: boolean;
  isAlt: boolean;
}

export type LocationEntry = {
  name: string;
  levelRange?: string;
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
  let currentEntry: PokemonEntry | null = null;

  for (let lineNo = 0; lineNo < lines.length; lineNo++) {
    const line = lines[lineNo].split(/#/)[0].trim();
    
    if (!line) {
      continue;
    }

    if (line.startsWith('-')) {
      if (currentEntry) {
        const mod = line.replace(/^-\s*/, '');
        const [modName, modArgs] = splitOnFirst(mod, /\s+/, ' ');
        
        currentEntry = applyMod(modName, modArgs, currentEntry);
        continue;
      } else {
        throw new EntryError(
          lineNo,
          `Modifier was used without a Pokémon to attach it to.`
        );
      }
    }

    if (currentEntry) {
      entries.push(finalizeEntry(currentEntry));
    }

    currentEntry = makeEntry(line, lineNo);
  }

  if (currentEntry) { // last entry
    entries.push(finalizeEntry(currentEntry));
  }

  return entries;
}

function finalizeEntry(_entry: PokemonEntry) {
  const entry = applyVanillaMon(_entry);

  if (!entry.types.length) {
    throw new EntryError(
      entry.lineNo,
      `Unknown Pokémon: <code>${entry.name}</code>. If this is a custom Pokémon, explicitly list its types as <code>${entry.name}<br />- type(Type1/Type2)</code>.`,
    );
  }

  if (!entry.locations.length) {
    entry.locations = [{ name: BASE_LOCATION_NAME }];
  }

  return entry;
}

const DEFAULT_IMAGE = 'https://raw.githubusercontent.com/tipsypastels/pokemonSprites/master/gen5/0.png';
const BASE_LOCATION_NAME = 'No location set';

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

export function sortLocationsByName(a: string, b: string) {
  if (a === BASE_LOCATION_NAME || a > b) {
    return 1;
  }

  if (b === BASE_LOCATION_NAME || b > a) {
    return -1;
  }

  return 0;
}