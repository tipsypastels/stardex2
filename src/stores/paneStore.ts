import SvelteSubject from '../util/SvelteSubject';
import storeLocally from '../util/storeLocally';
import { pluck } from 'rxjs/operators';

import Editor from '../panes/Editor.svelte';
import Intro from '../panes/Intro.svelte';
import Rundown from '../panes/Rundown.svelte';
import Locations from '../panes/Locations.svelte';
import Types from '../panes/Types.svelte';

export const PANE_TO_METADATA = {
  intro: {
    icon: 'chalkboard-teacher',
    component: Intro,
  },
  editor: {
    icon: 'file-edit',
    component: Editor,
  },
  rundown: {
    icon: 'list-ol',
    component: Rundown,
  },
  types: {
    icon: 'fire',
    component: Types,
  },
  locations: {
    icon: 'map-marker',
    component: Locations,
  },
};

export const PANE_NAMES = Object.keys(PANE_TO_METADATA) as PaneName[];
export type PaneName = keyof typeof PANE_TO_METADATA;
export type PaneSide = 'left' | 'right';

export class PaneSubject extends SvelteSubject<
{
    name: PaneName;
    side: PaneSide;
    lsKey: string;
  }
> {
  constructor(side: PaneSide, fallback: PaneName) {
    const lsKey = `stardex2-pane-${side}`;
    const name = (localStorage.getItem(lsKey) || fallback) as PaneName;
    super({ side, lsKey, name });
  }

  get component() {
    return PANE_TO_METADATA[this.value.name].component;
  }

  get icon() {
    return PANE_TO_METADATA[this.value.name].icon;
  }

  goto(name: PaneName) {
    this.next({ ...this.value, name });
  }

  storeLocally() {
    return this.pipe(
      pluck('name'),
      storeLocally(this.value.lsKey),
    );
  }
}

export const leftPane = new PaneSubject('left', 'intro');
export const rightPane = new PaneSubject('right', 'editor');