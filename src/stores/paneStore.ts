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
    isMobileOnlyPane: false,
  },
  editor: {
    icon: 'file-edit',
    component: Editor,
    isMobileOnlyPane: true,
  },
  rundown: {
    icon: 'list-ol',
    component: Rundown,
    isMobileOnlyPane: false,
  },
  types: {
    icon: 'fire',
    component: Types,
    isMobileOnlyPane: false,
  },
  locations: {
    icon: 'map-marker',
    component: Locations,
    isMobileOnlyPane: false,
  },
};

export const PANE_NAMES = Object.keys(PANE_TO_METADATA) as PaneName[];
export type PaneName = keyof typeof PANE_TO_METADATA;

export class PaneSubject extends SvelteSubject<
{
    name: PaneName;
    lsKey: string;
  }
> {
  constructor(fallback: PaneName) {
    const lsKey = `stardex2-pane`;
    const name = (localStorage.getItem(lsKey) || fallback) as PaneName;
    super({ lsKey, name });
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

export const pane = new PaneSubject('intro');