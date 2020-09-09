<script lang="ts">
  import { media } from 'svelte-match-media';
  import CodeBlock from '../generic/CodeBlock.svelte';
  import paneStore from '../stores/paneStore';
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

  You can leave blank lines for spacing or comment lines with <code>#</code>. Comments on the same line as code are not currently supported.
</p>

<p>
  Stardex supports regional forms, custom Pokémon, and custom types. To use any of these, you can specify a type using the <code>@type</code> modifier.
</p>

<CodeBlock code={`
Ducklett
Swanna

# Regional Forms
Dratini @type(Psychic)
Dragonair @type(Psychic/Dragon)

# Totally custom Pokémon and type
Opaling @type(Fantasy)

# A group modifier - applies to all Pokémon 
# below it until the next blank line.
[@type(Fire)]
Pichu
Pikachu
Raichu
`} />

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

  code {
    font-family: 'Ubuntu Mono';
    background-color: #222;
    color: white;
    padding: 2px 4px;
    border-radius: 4px;
  }
</style>