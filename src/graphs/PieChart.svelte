<script lang="ts">
  export let slices: Slice[];
  export let diameter = 300;
  export let isDonut = true;

  type Slice = {
    percent: number;
    color: string;
  }

  type SliceWithCoords = Slice & {
    cumulativePercent: number;
    d: string;
  };

  $: slicesWithCoords = slices.reduce<SliceWithCoords[]>(
    (acc, { percent, ...rest }) => {
      const last = acc[acc.length - 1];
      const prevCumulativePercent = last ? last.cumulativePercent : 0;
      const [startX, startY] = coordinates(prevCumulativePercent);

      const cumulativePercent = prevCumulativePercent + percent;
      const [endX, endY] = coordinates(cumulativePercent);

      const largeArcFlag = percent > 0.5 ? 1 : 0;

      const d = [
        `M ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'L 0 0',
      ].join(' ');

      return acc.concat({ 
        ...rest, 
        d,
        percent,
        cumulativePercent,
      });
    },
    [],
  );

  function coordinates(percent: number): [number, number] {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }
   
  function rgbToStyle(rgb: string) {
    const [r, g, b] = rgb.substr(4)
                         .replace(/\)$/, '')
                         .split(/\s*,\s*/)
                         .map(num => +num / 255);

    const cmin  = Math.min(r, g, b);
    const cmax  = Math.max(r, g, b);
    const delta = cmax - cmin;

    let h = 0;
    let s = 0;
    let l = 0;

    if (delta === 0) {
      h = 0;
    } else if (cmax === r) {
      h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);
    h = h < 0 ? (h + 360) : h;

    
    l = (cmax + cmin) / 2;
    
    if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));
    }

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `--h: ${h}; --s: ${s}%; --l: ${l}%;`;
  }
</script>

<svg viewBox="-1 -1 2 2" style={`height: ${diameter}px`}>
  {#each slicesWithCoords as slice}
    <path d={slice.d} style={rgbToStyle(slice.color)} />
  {/each}

  {#if isDonut}
    <circle r={0.6} cx={0} cy={0} fill="white" />
  {/if}
</svg>

<style>
  svg {
    transform: rotate(-90deg);
  }

  path {
    cursor: pointer;
    transition: fill 0.15s ease-in-out;
    fill: hsl(var(--h), var(--s), var(--l));
  }

  path:hover {
    fill: hsl(var(--h), var(--s), calc(var(--l) + 5%));
  }
</style>