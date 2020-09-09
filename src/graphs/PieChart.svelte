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
</script>

<svg viewBox="-1 -1 2 2" style={`height: ${diameter}px`}>
  {#each slicesWithCoords as slice}
    <path d={slice.d} fill={slice.color} />
  {/each}

  {#if isDonut}
    <circle r={0.6} cx={0} cy={0} fill="white" />
  {/if}
</svg>

<style>
  svg {
    transform: rotate(-90deg);
  }
</style>