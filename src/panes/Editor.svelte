<script lang="ts">
  import SvelteSubject from '../util/SvelteSubject';
  import { 
    input, 
    inputErrors,
    inputAutosave,
  } from '../stores/pokemonStore';
  import { fromEvent } from 'rxjs';
  import { onMount$ } from 'svelte-rx';
  import { 
  } from 'rxjs/operators';

  let textarea: HTMLTextAreaElement;

  $inputAutosave;
  

  // function getCursor() {
  //   const { selectionStart: line, value } = textarea;
  //   const entries = value.substr(0, line).split(/\n/);
  //   const text = entries[entries.length - 1];
  //   return { text, line: entries.length };
  // }

  // const shiftKeyEvent = onMount$.pipe<void>(
  //   concatMap(() => 
  //     fromEvent<KeyboardEvent>(textarea, 'keypress').pipe(
  //       filter(e => e.key === 'Enter' && e.ctrlKey),
  //       map(getCursor),
  //       tap(console.log),
  //     ),
  //   ),
  // );

  // $shiftKeyEvent; // bind
</script>

<div class="editor">
  <textarea 
    bind:value={$input} 
    bind:this={textarea} 
    autocorrect="off"
    autocapitalize="off"
    spellcheck={false}
    placeholder="Enter Pokémon names here!"
  />
  
  {#if $inputErrors}
    <div class="error">
      <h4>
        Line {$inputErrors.line + 1}
      </h4>
      
      {@html $inputErrors.message}    
    </div>
  {/if}
</div>


<style>
  .editor {
    flex-grow: 1;
    
    display: flex;
    flex-direction: column-reverse;

    width: 100%;
    height: 100%;

    background-color: #222;
    color: white;
  }

  textarea {
    background-color: transparent;
    color: inherit;

    border: none;
    resize: none;
    outline: none;

    padding: 0;
    padding-top: 0.5rem;

    font-size: 1.2rem;
    font-family: "Ubuntu Mono";

    flex-grow: 1;
  }

  textarea::-webkit-scrollbar {
    display: none;
  }

  .error {
    padding: 1rem;
    background-color: crimson;
    color: white;
  }

  .error h4 {
    margin-top: 0;
    margin-bottom: 0.25rem;
  }

  @media screen and (min-width: 768px) {
    .editor {
      flex-direction: column;
    }

    textarea {
      padding: 0.5rem;
      box-sizing: border-box;
    }
  }
</style>