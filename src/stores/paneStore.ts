import type { PaneName, PaneSide } from '../panes/panes';
import { writable } from 'svelte/store';
import { input } from './pokemonStore';

const DEFAULT_PANES: Record<PaneSide, PaneName> = {
  left: input.value ? 'rundown' : 'intro', 
  right: 'editor',
};

function createPaneStore() {
  const { subscribe, update } = writable(DEFAULT_PANES);

  function set(side: PaneSide, value: PaneName) {
    update(panes => {
      const newPanes = { ...panes };
      newPanes[side] = value;
      return newPanes;
    });
  }

  return { subscribe, set };
}

const paneStore = createPaneStore();
export default paneStore;