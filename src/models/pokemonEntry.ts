import { applyMod } from './modifier';

export type PokemonEntry = {
  name: string;
  types: string[];
  isFiller?: true;
  isIgnore?: true;
  isAlt?: true;
}

export function pokemonEntriesFrom(text: string) {
  const lines = text.split(/\n/);
  const entries: PokemonEntry[] = [];

  for (let line of lines) {
    line = line.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const [name, ...mods] = line.split(/@/);
    let entry: Partial<PokemonEntry> = { name };

    for (const mod of mods) {
      const match = /([a-z]+)(?:\((.*?)\))?/g.exec(mod)
      
      if (!match) {
        throw new SyntaxError(`Invalid usage of modifier ${mod}`);
      }

      const [, modName, modArgs] = match;
      entry = applyMod(modName, modArgs, entry);
    }

    if (!entry.types?.length) {
      throw new Error(
        `Can't infer types for Pokémon \"${name}\". List them explicitly as the desired type, such as ${name} @types(Fire/Fighting)`
      );
    }

    entries.push(entry as PokemonEntry);
  }

  return entries;
}