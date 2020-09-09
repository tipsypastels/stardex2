<script lang="ts">
  import { media } from 'svelte-match-media';
  import Pane from './panes/Pane.svelte';
</script>

<div class="app">
  <Pane number={0} />

  {#if $media.tablet}
    <Pane number={1} />
  {/if}
</div>

<style>
  .app {
    --divider: #ccc;
    --highlight: tomato;

    box-sizing: border-box;
    position: relative;
    height: 100%;

    display: grid;
    grid-template-columns: 1fr;
    column-gap: 1rem;
  }

  @media screen and (min-width: 768px) {
    .app {
      padding: 1rem;
      grid-template-columns: 1fr 1fr;
    }
  }
</style>