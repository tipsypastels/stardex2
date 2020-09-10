<script lang="ts">
  import { media } from 'svelte-match-media';
  import Pane from './panes/Pane.svelte';
  import { leftPane, rightPane } from './stores/paneStore';

  let height: number;
</script>

<svelte:window bind:innerHeight={height} />

<div class="app" style="height: {height}px;">
  <Pane pane={leftPane} />

  {#if $media.tablet}
    <Pane pane={rightPane} />
  {/if}
</div>

<style>
  .app {
    --divider: #ccc;
    --divider-light: #ddd;
    --highlight: tomato;

    box-sizing: border-box;
    position: relative;

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