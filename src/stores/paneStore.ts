import type { PaneName } from '../panes/panes';
import { writable } from 'svelte/store';

const DEFAULT_PANES: PaneName[] = ['rundown', 'editor'];

function createPaneStore() {
  const { subscribe, update } = writable(DEFAULT_PANES);

  function set(index: number, value: PaneName) {
    update(panes => {
      const newPanes = [...panes];
      newPanes[index] = value;
      return newPanes;
    });
  }

  return { subscribe, set };
}

const paneStore = createPaneStore();
export default paneStore;