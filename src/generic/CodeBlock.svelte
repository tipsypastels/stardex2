<script lang="ts">
  export let code: string;

  type LineData = {
    content: string;
    type: 'comment' | 'mod-group' | 'blank' | 'content';
  }

  function toLineData(content: string): LineData {
    content = content.trim().replace(/\n$/, '');

    switch (content.charAt(0)) {
      case '': {
        return { content: '\n', type: 'blank' };
      }
      case '#': {
        return { content, type: 'comment' };
      }
      case '[': {
        return { content, type: 'mod-group' };
      }
      default: {
        return { content, type: 'content' };
      }
    }
  }

  $: lines = code.trim().split(/\n/).map(toLineData);
</script>

<code>
  {#each lines as line}
    <div class="line line-{line.type}">
      <pre>{line.content}</pre>
    </div>
  {/each}
</code>

<style>
  code {
    display: block;
    padding: 1rem;
    border: 1px solid var(--divider);
  }

  pre {
    font-family: "Ubuntu Mono";
    margin: 0;
  }

  .line-comment {
    color: #777;
  }

  .line-content,
  .line-mod-group {
    color: #222;
  }
</style>