<script lang="ts">
  import { media } from 'svelte-match-media';
  import { PANE_NAMES } from '../stores/paneStore';
  import type { PaneSubject } from '../stores/paneStore';
  import type { PaneName } from '../stores/paneStore';
  import PaneBrowser from './PaneBrowser.svelte';
  import PaneMobile from './PaneMobile.svelte';

  export let pane: PaneSubject;

  const paneLocalStorage = pane.storeLocally();
  $paneLocalStorage; // subscribe
</script>

{#if $media.tablet}
  <PaneBrowser pane={pane} />
{:else}
  <PaneMobile pane={pane} />
{/if}