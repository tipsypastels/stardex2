import type { PaneName } from '../panes/panes';
import SvelteSubject from '../util/SvelteSubject';
import storeLocally from '../util/storeLocally';
import PANE_TO_COMPONENT from '../panes/panes';
import { pluck } from 'rxjs/operators';

type PaneSide = 'left' | 'right';

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

  get name() {
    return this.value.name;
  }

  get side() {
    return this.value.side;
  }

  get component() {
    return PANE_TO_COMPONENT[this.name];
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