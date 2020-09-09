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
    <small>Distinct Types</small>
  </div>
</div>

<style>
  .stats {
    display: flex;
  }

  .stat {
    border: 1px solid var(--divider);
    padding: 0.5rem;
  }

  .stat:not(:last-child) {
    border-right: 0;
  }

  .stat h1 {
    margin: 0;
  }

  .stat small {
    font-size: 0.9rem;
  }
</style>