<script lang="ts">
  import { PANE_NAMES } from '../stores/paneStore'; 
  import type { PaneSubject } from "../stores/paneStore";
  export let pane: PaneSubject;
</script>

<section class="pane">
  <nav class="pane-nav">
    {#each PANE_NAMES as name}
      <button
        class="pane-button"
        class:active={$pane.name === name}
        on:click={() => pane.goto(name)}
      >
        {name}
      </button>
    {/each}
  </nav>

  <div class="pane-body">
    <svelte:component this={pane.component} />
  </div>
</section>

<style>
  .pane {
    padding: 1rem;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid var(--divider);
    overflow-y: scroll;

    display: flex;
    flex-direction: column;
  }

  .pane-nav {
    display: flex;
    margin-bottom: 1rem;
  }

  .pane-button {
    margin-bottom: 0;
    
    border: none;
    border-bottom: 2px solid transparent;

    padding: 0.5rem;
    padding-top: 0;

    background-color: transparent;
    text-transform: capitalize;
    font-weight: bold;

    outline: none;
    cursor: pointer;
  }

  .pane-button.active {
    border-bottom-color: var(--highlight);
  }

  .pane-body {
    flex-grow: 1;
  }
</style>