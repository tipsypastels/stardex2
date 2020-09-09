<script lang="ts">
  export let name: string;
  export let group: 'fal' | 'fas' | 'far' | 'fab' = 'far';
  export let fw = true;
</script>

<i class={`${group} fa-${name}`} class:fa-fw={fw} />