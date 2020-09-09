<script lang="ts">
  import PieChart from './PieChart.svelte';
  import Icon from '../generic/Icon.svelte';
  import { typeColor, typeIcon } from '../models/type';

  export let showNames = true;
  export let types: ({ value: any, percent: number, count: number })[];

  $: slices = types.map((type) => ({
    ...type,
    icon: typeIcon(type.value),
    color: typeColor(type.value),
  }));
</script>

<div class="container">
  <div class="chart">
    <PieChart slices={slices} />
  </div>

  {#if showNames}
    <ul>
      {#each slices as { value, icon, color, percent, count } (value)}
        <li>
          <strong style={`color: ${color}`}>
            <Icon name={icon} group="fas" /> 
            {value}
          </strong>
          — {(100 * percent).toFixed(1)}% ({count})
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
  }

  ul {
    list-style: none;
  }

  li {
    padding: 4px 0;
  }
</style>