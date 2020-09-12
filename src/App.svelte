<script lang="ts">
  import { media } from 'svelte-match-media';
  import Editor from './panes/Editor.svelte';
  import Pane from './panes/Pane.svelte';

  let height: number;
</script>

<svelte:window bind:innerHeight={height} />

<div class="app" style="height: {height}px;">
  {#if $media.tablet}
    <Editor />
  {/if}
  
  <Pane />
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
  }

  @media screen and (min-width: 768px) {
    .app {
      grid-template-columns: 450px 1fr;
    }
  }
</style>