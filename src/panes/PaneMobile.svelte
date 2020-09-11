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

<main class="pane">
  <h1 on:click={() => isExpanded = !isExpanded}>
    {$pane.name}<span class="menu"><Icon name="caret-down" group="fas" /></span>
  </h1>

  <div class="pane-body">
    <svelte:component this={pane.component} />
  </div>
</main>

<div 
  class="pane-nav-wrapper" 
  class:expanded={isExpanded}
  on:click|self={close}
>
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

<style>
  h1 {
    text-transform: capitalize;
  }

  .menu {
    font-size: 1.2rem;
  }

  .pane {
    display: flex;
    flex-direction: column;
  }

  .pane-body {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
  }

  .pane-nav-wrapper {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    pointer-events: none;
  }

  .pane-nav-wrapper.expanded {
    pointer-events: initial;
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

    transition: transform 0.25s ease-in-out;
    transform: translateY(105%);
  }

  .pane-nav-wrapper.expanded .pane-nav {
    transform: translateY(0);
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