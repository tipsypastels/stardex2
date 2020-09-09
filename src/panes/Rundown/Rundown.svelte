<script lang="ts">
  import { analytics, distinctTypesCount } from '../../stores/pokemonStore';
</script>

<div class="stats">
  <div class="stat">
    <h1>{$analytics.length}</h1>
    <small>Pokémon</small>
  </div>

  <div class="stat">
    <h1>{$distinctTypesCount}</h1>
    <small>Types</small>
  </div>
</div>

<style>
  .stats {
    display: flex;
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