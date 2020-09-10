<script lang="ts">
import CodeBlock from '../generic/CodeBlock.svelte';
  import EntryListing from '../generic/EntryListing.svelte';
  import { locationDistribution } from '../stores/pokemonStore';
</script>

{#if $locationDistribution.length > 1}
  {#each $locationDistribution as { location, entries } (location)}
    <div class="location">
      <h3 class="location-title">
        <span>
          {location}
        </span>
      </h3>

      <div class="entries">
        {#each entries as entry (entry.name)}
          <EntryListing entry={entry} />
        {/each}
      </div>
    </div>
  {/each}
{:else}
    <div class="no-locations">
      <h3 class="no-locations-title">
        Your Pokédex does not define any locations.
      </h3>

      <p>
        If you want to list Pokémon locations, define them for all or some of your Pokémon using the <code>@at</code> modifier. Here's an example.
      </p>

      <CodeBlock code={`
        Ducklett @at(Route 53, Mossy Pond)
        Swanna @at(Mossy Pond)
      `} />

      <p>
        You can also include a level range for the encounter in question.
      </p>

      <CodeBlock code={`
        Ducklett @at(Route 53 : 1-3, Mossy Pond : 5-7)
        Swanna @at(Mossy Pond : 7-9)
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
</style>