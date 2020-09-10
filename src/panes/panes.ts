import Editor from './Editor.svelte';
import Intro from './Intro.svelte';
import Rundown from './Rundown.svelte';
import Locations from './Locations.svelte';

const PANE_TO_COMPONENT = {
  intro: Intro,
  editor: Editor,
  rundown: Rundown,
  locations: Locations,
};

export default PANE_TO_COMPONENT;
export const PANE_NAMES = Object.keys(PANE_TO_COMPONENT) as PaneName[];
export type PaneName = keyof typeof PANE_TO_COMPONENT;