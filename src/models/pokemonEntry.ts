import { applyMod } from './modifiers/list';
import { 
  applyVanillaMon, 
  didYouMeanVanillaMon, 
  normalizeVanillaName, 
} from './vanillaPokemon';
import { splitOnFirst } from '../util/string';

export type PokemonEntry = {
  lineNo: number;
  name: string;
  image: string | undefined;
  types: string[];
  locations: LocationEntry[];
  isFiller: boolean;
  isIgnored: boolean;
  isAlt: boolean;
  isNoDerive: boolean;
}

export type LocationEntry = {
  name: string;
  levelRange?: string;
  rarity?: number;
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

  if (!entry.image) {
    entry.image = DEFAULT_IMAGE;
  }

  if (!entry.types.length) {
    const didYouMean = didYouMeanVanillaMon(entry);

    if (didYouMean) {
      throw new EntryError(
        entry.lineNo,
        `Unknown Pokémon: <code>${entry.name}</code>. Did you mean <code>${didYouMean}</code>?`,
      );
    } 
    
    if (entry.isNoDerive) {
      throw new EntryError(
        entry.lineNo,
        `Non-derived Pokémon <code>${entry.name}</code> must explicitly specify types with with the <code>type</code> modifier. `,
      )
    }

    throw new EntryError(
      entry.lineNo,
      `Unknown Pokémon: <code>${entry.name}</code>.<br />If this is a custom Pokémon, explicitly list its types with the <code>type</code> modifier.`,
    );
  }
  
  return entry;
}

const DEFAULT_IMAGE = 'https://raw.githubusercontent.com/tipsypastels/pokemonSprites/master/gen5/0.png';

function makeEntry(name: string, lineNo: number): PokemonEntry {
  return {
    lineNo,
    name: normalizeVanillaName(name),
    image: undefined,
    types: [],
    locations: [],
    isFiller: false,
    isAlt: false,
    isIgnored: false,
    isNoDerive: false,
  }
}