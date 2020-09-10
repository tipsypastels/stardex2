<script lang="ts">
  import TypeName from './TypeName.svelte';
  import type { PokemonEntry } from "../models/pokemonEntry";

  export let entry: PokemonEntry & { levelRange?: string };
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

      {#if entry.levelRange}
        <span class="level-range">
          (Lv. {entry.levelRange.replace(/\b-\b/, ' - ')})
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

  .level-range {
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