<script lang="ts">
  import CodeBlock from '../generic/CodeBlock.svelte';
  import TypePieChart from '../graphs/TypePieChart.svelte';
  
  import { from, of } from 'rxjs';
  import { flatMap, map, mergeAll, pluck, startWith } from 'rxjs/operators';
  import { media } from 'svelte-match-media';
  import { pokemonEntriesFrom } from '../models/pokemonEntry';
  import { leftPane, rightPane } from '../stores/paneStore';
  import toGraphSlices from '../util/toGraphSlices';

  const sampleCode = `
    # Some official Pokémon
    Ducklett
    Swanna

    # Regional forms
    Dratini
    - type Psychic
    Dragonair
    - type Psychic/Dragon
    Dragonite
    - type Psychic/Dragon

    # Totally custom Pokémon and type
    Opaling
    - type Fantasy
  `;

  const typeDistribution = of(sampleCode).pipe(
    map(pokemonEntriesFrom),
    flatMap(entries => 
      from(entries).pipe(
        pluck('types'),
        mergeAll(),
        toGraphSlices(),
      ),
    ),
  );
</script>

<h1>
  Stardex
</h1>

<p>
  Welcome to Stardex! This is a tool designed to help you build balanced Pokédexes for Pokémon fangames. 
</p>

<p>
  {#if $media.tablet}
    Start by entering some Pokémon names in the <strong>Editor</strong> pane.
  {:else}
    Start by <button on:click={() => leftPane.goto('editor')}>switching to the editor tab</button> and entering some Pokémon names!
  {/if}

  You can leave blank lines for spacing or comment lines with <code>#</code>
</p>

<p>
  Stardex supports regional forms, custom Pokémon, and custom types. To use any of these, you can specify a type using the <em>modifier</em> syntax, written as a line with a dash after a Pokémon name.
</p>

<CodeBlock code={sampleCode} />

<p>
  You can visit the <button on:click={() => rightPane.goto('rundown')}>rundown</button> tab to get totals of Pokémon, types, and other useful numbers, along with a graph of the type distribution. In the case of the above list, the graph will look like this:
</p>

<TypePieChart types={$typeDistribution} />

<style>
  button {
    background-color: transparent;
    color: tomato;
    border: none;
    outline: none;
    padding: 0;

    font-size: 1rem;
    font-weight: bold;
    font-family: var(--body-font);

    cursor: pointer;
  }
</style>