<script lang="ts">
  import SvelteSubject from '../util/SvelteSubject';
  import { 
    input, 
    analytics,
    inputAutosave,
  } from '../stores/pokemonStore';
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

  $inputAutosave;

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
  <textarea bind:value={$input} bind:this={textarea} />
  
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
    font-family: "Ubuntu Mono";

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