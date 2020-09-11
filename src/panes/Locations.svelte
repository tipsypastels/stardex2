<script lang="ts">
  import CodeBlock from '../generic/CodeBlock.svelte';
  import EntryListing from '../generic/EntryListing.svelte';
  import Icon from '../generic/Icon.svelte';
  import { 
    locationDistribution, 
    locationUnsetEntries,
  } from '../stores/pokemonStore';
</script>

{#if $locationDistribution.length}
  {#each $locationDistribution as { 
    location, entries, totalRarity 
  } (location)}
    <div class="location">
      <h3 class="location-title">
        <span>
          {location}
        </span>
      </h3>

      {#if typeof totalRarity !== 'undefined' && totalRarity !== 100}
        <div class="total-rarity-warning">
          <Icon name="exclamation-circle" group="fas"/>
          Rarities for this location don't add up to 100%.
        </div>
      {/if}

      <div class="entries">
        {#each entries as entry (entry.name)}
          <EntryListing entry={entry} />
        {/each}
      </div>
    </div>
  {/each}

  {#if $locationUnsetEntries.length}
    <div class="location">
      <h3 class="location-title">
        <span>Pokémon without locations</span>
      </h3>

      <div class="entries">
        {#each $locationUnsetEntries as entry (entry.name)}
          <EntryListing entry={entry} />
        {/each}
      </div>
    </div>
  {/if}
{:else}
    <div class="no-locations">
      <h3 class="no-locations-title">
        Your Pokédex does not define any locations.
      </h3>

      <p>
        If you want to list Pokémon locations, define them for all or some of your Pokémon using the <code>at</code> modifier. Here's an example.
      </p>

      <CodeBlock code={`
        Ducklett 
        - at Route 53
        - at Mossy Pond
        Swanna
        - at Mossy Pond
      `} />

      <p>
        You can also include a level range and rarity for the encounter in question.
      </p>

      <CodeBlock code={`
        Ducklett 
        - at Route 53, level 1-3, rarity 100%
        - at Mossy Pond, level 5-7, rarity 50%
        Swanna
        - at Mossy Pond, level 5-7, rarity: 50%
      `} />
    </div>
{/if}


<style>
  .location-title {
    overflow: hidden;
  }

  .location-title span {
    position: relative;
    display: inline-block;
  }

  .location-title span::after {
    content: '';
    
    position: absolute;
    top: 50%;
    left: 100%;
    width: 10000%;

    border-bottom: 1px solid var(--divider-light);
    margin: 0 20px;
  }

  .total-rarity-warning {
    color: var(--highlight);
    font-weight: bold;
    font-size: 0.9rem;
  }
</style>