<script lang="ts">
  import { media } from 'svelte-match-media';
  import paneStore from '../../stores/paneStore';
</script>

<h1>
  Stardex
</h1>

<p>
  Welcome to Stardex! This is a tool designed to help you build balanced Pokédexes for Pokémon fangames. 
</p>

<p>
  {#if $media.tablet}
    Start by entering some Pokémon names in the <strong>Editor</strong> pane.
  {:else}
    Start by <button on:click={() => paneStore.set(0, 'editor')}>switching to the editor tab</button> and entering some Pokémon names!
  {/if}
</p>

<style>
  button {
    background-color: rgba(255, 99, 71, 0.3);
    border: none;
    outline: none;
    padding: 0;

    font-size: 1rem;
    font-weight: bold;
    font-family: var(--body-font);
  }
</style>