<script lang="ts">
  export let name: string;
  export let group: 'fal' | 'fas' | 'far' | 'fab' = 'far';
  export let fw = true;

  let className: string | undefined;
  export { className as class };
</script>

<i class="{group} fa-{name} {className}" class:fa-fw={fw} />