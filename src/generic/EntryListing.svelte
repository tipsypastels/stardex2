<script lang="ts">
  import TypeName from './TypeName.svelte';
  import type { LocationEntry, PokemonEntry } from "../models/pokemonEntry";

  export let entry: PokemonEntry & Omit<LocationEntry, 'name'>;

  $: parens = (function() {
    let parens: string[] = [];

    if (entry.levelRange) {
      parens.push(`Lv. ${entry.levelRange.replace(/\b-\b/, ' - ')}`)
    }

    if (entry.rarity) {
      parens.push(`${entry.rarity}%`);
    }

    return parens;
  })();
</script>

<div class="entry">
  <img
    src={entry.image}
    alt=""
    width={64}
    height={64}
  />

  <div class="entry-main">
    <h4>
      {entry.name}

      {#if parens.length}
        <span class="parens">
          ({parens.join(', ')})
        </span>
      {/if}
    </h4>

    <div class="entry-types">
      {#each entry.types as type (type)}
        <div class="entry-type">
          <TypeName type={type} />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .entry {
    display: flex;
    align-items: center;
  }

  h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  .parens {
    font-size: 95%;
    font-weight: 400;
  }

  .entry-types {
    display: flex;
  }

  .entry-type {
    display: block;
    font-size: 0.9rem;
  }

  .entry-type:not(:last-child) {
    margin-right: 0.5rem;
  }
</style>