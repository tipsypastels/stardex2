<script lang="ts">
  import TypePieChart from '../graphs/TypePieChart.svelte';
  import { typeDistribution } from '../stores/pokemonStore';
</script>

<TypePieChart types={$typeDistribution} />