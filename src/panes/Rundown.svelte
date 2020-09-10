<script lang="ts">
  import TypePieChart from '../graphs/TypePieChart.svelte';

  import { 
    pokemonCount, 
    typesCount, 
    fillersCount,
    locationsCount,
    typeDistribution, 
  } from '../stores/pokemonStore';
</script>

<div class="stats">
  <div class="stat">
    <h1>{$pokemonCount}</h1>
    <small>Pokémon</small>
  </div>

  <div class="stat">
    <h1>{$typesCount}</h1>
    <small>{$typesCount === 1 ? 'Type' : 'Types'}</small>
  </div>

  <div class="stat">
    <h1>{$fillersCount}</h1>
    <small>Filler</small>
  </div>

  <div class="stat">
    <h1>{$locationsCount}</h1>
    <small>{$locationsCount === 1 ? 'Location' : 'Locations'}</small>
  </div>
</div>

<TypePieChart types={$typeDistribution} />

<style>
  .stats {
    display: flex;
    margin-bottom: 2rem;
  }

  .stat {
    border: 1px solid var(--divider);
    padding: 0.5rem;
    width: 4rem;
  }

  .stat:not(:last-child) {
    margin-right: 0.5rem;
  }

  .stat h1 {
    margin: 0;
  }

  .stat small {
    font-size: 0.9rem;
  }
</style>