<script lang="ts">
  import { fly } from 'svelte/transition';
  import { media } from 'svelte-match-media';
  import { flash } from './stores/flashStore';
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

  {#if $flash}
    <div 
      class="flash" 
      style="background-color: {$flash?.color};" 
      transition:fly={{ y: 200, duration: 1000 }}
      role="alert"
    >
      {$flash?.message}
    </div>
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
  }

  .flash {
    position: fixed;
    bottom: 1rem;

    font-size: 1.1rem;
    font-weight: bold;
    color: white;

    padding: 4px 8px;
    border-radius: 4px;

    left: 50%;
    transform: translateX(-50%);
  }

  @media screen and (min-width: 768px) {
    .app {
      grid-template-columns: 450px 1fr;
    }
  }
</style>