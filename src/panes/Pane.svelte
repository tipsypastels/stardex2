<script lang="ts">
  import PANES, { PANE_NAMES } from './panes';
  import type { PaneSide } from './panes';
  import paneStore from '../stores/paneStore';
  import type { PaneName } from './panes';
  export let side: PaneSide;

  $: pane = $paneStore[side];
  $: Component = PANES[pane];

  $: baseId = `pane-${side}`;
  $: currentButtonId = `pane-button-${side}-${pane}`;

  function goto(pane: PaneName) {
    paneStore.set(side, pane);
  }
</script>

<section class="pane">
  <nav 
    role="tablist" 
    class="pane-nav" 
    aria-label={`Controls for pane ${side}`}
  >
    {#each PANE_NAMES as thisPane}
      <button
        role="tab"
        class="pane-button"
        class:active={pane === thisPane}
        aria-selected={pane === thisPane}
        aria-controls={baseId}
        id={`pane-button-${side}-${thisPane}`}
        tabindex={-1}
        on:click={() => goto(thisPane)}
      >
        {thisPane}
      </button>
    {/each}
  </nav>

  <div 
    role="tabpanel"
    class="pane-body"
    aria-labelledby={currentButtonId}
    tabIndex={0}
    id={baseId}
  >
    <svelte:component this={Component} />
  </div>
</section>

<style>
  .pane {
    padding: 1rem;
    height: 100%;
    box-sizing: border-box;

    display: flex;
    flex-direction: column-reverse;
  }

  .pane-nav {
    display: flex;
    margin-top: 1rem;
    border: 1px solid var(--divider);
  }

  .pane-button {
    margin-bottom: 0;
    
    border: none;
    border-bottom: 2px solid transparent;
    
    padding: 0.5rem;

    background: transparent;
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
    outline: none;
  }

  @media screen and (min-width: 768px) {
    .pane {
      border: 1px solid var(--divider);
      flex-direction: column;
    }

    .pane-nav {
      margin-top: 0;
      margin-bottom: 1rem;
      border: none;
    }
    
    .pane-button {
      padding-top: 0;
    }
  }
</style>