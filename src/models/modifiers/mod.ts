import { PokemonEntry, EntryError } from '../pokemonEntry';

type ValidationError =
  | string
  | ((value: string) => string);

type Arg<N extends string> = Record<N, {
  isKwarg?: true;
  isOptional?: true;
  missingExample?: string;
  validate?: {
    with: RegExp | ((raw: string) => boolean);
    message: ValidationError;
  }
}>;

type FnArgs<N extends string> = Record<N, string>;

type Fn<N extends string>
  = (
    mon: PokemonEntry, 
    args: FnArgs<N>,
    usedModName: string, 
  ) => PokemonEntry;

export default class Mod<N extends string> {
  private hasNoArgs: boolean;

  private readonly KW_ARG = /^(\w+)\s*=\s*(.+)/;

  constructor(private args: Arg<N>, private func: Fn<N>) {
    this.hasNoArgs = Object.keys(args).length === 0;
  }

  call(mon: PokemonEntry, rawArgs: string, usedModName: string) {
    return this.func(
      mon, 
      this.parseArgs(rawArgs, usedModName, mon.lineNo),
      usedModName, 
    );
  }

  private parseArgs(
    rawArgs: string, 
    usedModName: string, 
    lineNo: number,
  ): FnArgs<N> {
    if (this.hasNoArgs) {
      return {} as FnArgs<N>;
    }

    const expectedArgs = Object.keys(this.args) as N[];
    const matchedArgs: Partial<FnArgs<N>> = {};
    const argBits = rawArgs.split(/\s*,\s*/);
    
    for (const argBit of argBits) {
      let match = argBit.match(this.KW_ARG);
      if (match) {
        const keyword = match[1] as N;
        const value = match[2];
        
        if (!(keyword in this.args)) {
          throw new EntryError(
            lineNo,
            `Keyword <code>${keyword}</code> does not exist on modifier <code>${usedModName}</code>.`,
          );
        }

        const indexInExpected = expectedArgs.indexOf(keyword);

        if (indexInExpected === -1) {
          throw new EntryError(
            lineNo,
            `Duplicate keyword <code>${keyword}</code> for modifier <code>${usedModName}</code>.`,
          );
        }

        expectedArgs.splice(indexInExpected, 1);
        matchedArgs[keyword] = this.validateArgValue(
          keyword,
          value,
          usedModName,
          lineNo,
        );
      } else {
        const indexInExpected = expectedArgs.findIndex(
          argName => !this.args[argName].isKwarg,
        );

        if (indexInExpected === -1) {
          throw new EntryError(
            lineNo,
            `Unknown positional argument <code>${argBit}</code> for modifier <code>${usedModName}</code>. Could you have passed too many positional arguments?`,
          );
        }

        const argName = expectedArgs[indexInExpected];
        expectedArgs.splice(indexInExpected, 1);

        matchedArgs[argName] = this.validateArgValue(
          argName,
          argBit,
          usedModName,
          lineNo,
        );
      }
    }

    const missingRequiredArgs = expectedArgs.filter(
      argName => !this.args[argName].isOptional,
    );

    if (missingRequiredArgs.length) {
      const firstMissing = missingRequiredArgs[0];
      const { isKwarg, missingExample } = this.args[firstMissing];

      throw new EntryError(
        lineNo,
        `Missing required ${isKwarg ? 'keyword ' : 'positional '}argument <code>${missingRequiredArgs[0]}</code> for modifier <code>${usedModName}</code>.${missingExample ? ` Example: ${missingExample}` : ''}`,
      );
    }

    return matchedArgs as FnArgs<N>;
  }

  private validateArgValue(
    name: N,
    value: string,
    usedModName: string,
    lineNo: number,
  ) {
    const { validate, isKwarg } = this.args[name];

    if (!validate) {
      return value;
    }

    const isValid = (typeof validate.with === 'function')
      ? validate.with(value)
      : validate.with.exec(value);

    if (isValid) {
      return value;
    }

    throw new EntryError(
      lineNo,
      `Argument <code>${name}</code> for modifier ${usedModName} ${validationError(value, validate.message)}.`,
    );
  }
}

function validationError(value: string, error: ValidationError) {
  return (typeof error === 'function') ? error(value) : error; 
}