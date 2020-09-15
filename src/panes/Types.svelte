<script lang="ts">
  import TypePieChart from '../graphs/TypePieChart.svelte';
  import { typeDistribution } from '../stores/pokemonStore';
  import { vanillaDexes } from '../models/vanillaDex';
  import {
    selectedVanillaDexes, 
    selectedDexesAverageAnalytics, 
  } from '../stores/vanillaTypeStore';
</script>

<TypePieChart types={$typeDistribution} />

{#if $selectedDexesAverageAnalytics.length}
  <TypePieChart types={$selectedDexesAverageAnalytics} />
{/if}

{#each vanillaDexes as vanillaDex}
  <label>
    <input
      type=checkbox 
      value={vanillaDex}
      bind:group={$selectedVanillaDexes}
    />

    {vanillaDex}
  </label>
{/each}