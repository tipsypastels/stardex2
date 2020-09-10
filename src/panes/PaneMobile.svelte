<script lang="ts">
  import Icon from "../generic/Icon.svelte";
  import { PANE_NAMES, PANE_TO_METADATA } from '../stores/paneStore';
  import type { PaneName, PaneSubject } from "../stores/paneStore";

  export let pane: PaneSubject;

  let isExpanded = false;

  function goto(name: PaneName) {
    pane.goto(name);
    isExpanded = false;
  }

  function close() {
    isExpanded = false;
  }
</script>

<button class="expand-panes" on:click={() => isExpanded = !isExpanded}>
  <Icon name="bars" />
</button>

<main class="pane">
  <svelte:component this={pane.component} />
</main>

{#if isExpanded}
  <div class="pane-nav-wrapper" on:click|self={close}>
    <nav class="pane-nav">
      {#each PANE_NAMES as name}
        <button 
          class="pane-button" 
          class:active={name === $pane.name}
          on:click={() => goto(name)}
        >
          <div class="pane-icon">
            <Icon name={PANE_TO_METADATA[name].icon} />
          </div>
  
          <div class="pane-label">{name}</div>
        </button>
      {/each}
    </nav>
  </div>
{/if}

<style>
  .expand-panes {
    position: fixed;
    bottom: 0;
    right: 0;

    margin: 1rem;

    background-color: var(--highlight);
    color: white;
    border: none;
    font-size: 1.7rem;

    height: 55px;
    width: 55px;
    
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .pane-nav-wrapper {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
  }

  .pane-nav {
    padding: 1rem;
    box-sizing: border-box;
    box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.5);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;

    background-color: #222;
    color: white;

    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }

  .pane-button {
    background-color: rgba(0, 0, 0, 0.1);
    color: var(--highlight);

    display: block;
    padding: 0.5rem;
    border: 2px solid var(--highlight);

    font-size: 1rem;
    font-weight: bold;
    text-transform: capitalize;
    text-align: left;
  }

  .pane-button.active {
    color: #222;
    background-color: var(--highlight);
  }

  .pane-icon {
    font-size: 1.3rem;
    display: block;
    margin-bottom: 0.5rem;
  }
</style>