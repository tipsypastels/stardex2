<script lang="ts">
  import SvelteSubject from '../../util/SvelteSubject';
  import { input, analytics } from '../../stores/pokemonStore';
  import { fromEvent } from 'rxjs';
  import { onMount$ } from 'svelte-rx';
  import { 
    concatMap,
    debounceTime, 
    filter, 
    map, 
    startWith, 
    switchMap,
    tap, 
  } from 'rxjs/operators';

  let textarea: HTMLTextAreaElement;

  function getCursor() {
    const { selectionStart: line, value } = textarea;
    const entries = value.substr(0, line).split(/\n/);
    const text = entries[entries.length - 1];
    return { text, line: entries.length };
  }

  const shiftKeyEvent = onMount$.pipe<void>(
    concatMap(() => 
      fromEvent<KeyboardEvent>(textarea, 'keypress').pipe(
        filter(e => e.key === 'Enter' && e.ctrlKey),
        map(getCursor),
        tap(console.log),
      ),
    ),
  );

  $shiftKeyEvent; // bind
</script>

<div class="editor">
  <!-- svelte-ignore a11y-autofocus-->
  <textarea 
    autofocus 
    bind:value={$input}
    bind:this={textarea}
  />
  
  <!-- {#if $analytics.error}
    <div class="error">
      {$analytics.error}    
    </div>
  {/if} -->
</div>


<style>
  .editor {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
  }

  textarea {
    border: none;
    resize: none;
    outline: none;

    font-size: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;;

    padding: 0.5rem;
    box-sizing: border-box;

    flex-grow: 1;
  }

  .error {
    padding: 1rem;
    background-color: crimson;
    color: white;
  }
</style>