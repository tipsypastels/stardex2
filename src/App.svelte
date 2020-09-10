<script lang="ts">
  import { media } from 'svelte-match-media';
  import Pane from './panes/Pane.svelte';
  import { leftPane, rightPane } from './stores/paneStore';
</script>

<div class="app">
  <Pane pane={leftPane} />

  {#if $media.tablet}
    <Pane pane={rightPane} />
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