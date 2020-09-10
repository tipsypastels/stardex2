<script lang="ts">
  import { typeColor, typeIcon } from "../models/type";
  import Icon from "./Icon.svelte";

  export let type: string;

  $: color = typeColor(type);
  $: icon = typeIcon(type);
</script>

<strong style="color: {color};">
  <Icon name={icon} group="fas" />
  {type}
</strong>