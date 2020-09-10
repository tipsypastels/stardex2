<script lang="ts">
  import { PANE_NAMES } from '../stores/paneStore';
  import type { PaneSubject } from '../stores/paneStore';
  import type { PaneName } from '../stores/paneStore';

  export let pane: PaneSubject;

  const paneLocalStorage = pane.storeLocally();
  $paneLocalStorage; // subscribe

  $: baseId = `pane-${$pane.side}`;
  $: currentButtonId = `pane-button-${$pane.side}-${$pane.name}`;
</script>

<section class="pane">
  <nav 
    role="tablist" 
    class="pane-nav" 
    aria-label="Controls for pane {$pane.side}"
  >
    {#each PANE_NAMES as name}
      <button
        role="tab"
        class="pane-button"
        class:active={$pane.name === name}
        aria-selected={$pane.name === name}
        aria-controls={baseId}
        id="pane-button-{$pane.side}-{name}"
        tabindex={-1}
        on:click={() => pane.goto(name)}
      >
        {name}
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
    <svelte:component this={pane.component} />
  </div>
</section>

<style>
  .pane {
    padding: 1rem;
    height: 100%;
    box-sizing: border-box;
    overflow-y: scroll;

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