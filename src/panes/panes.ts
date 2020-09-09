import Editor from './Editor/Editor.svelte';
import Intro from './Intro/Intro.svelte';
import Rundown from './Rundown/Rundown.svelte';

const PANES = {
  intro: Intro,
  editor: Editor,
  rundown: Rundown,
};

export default PANES;
export const PANE_NAMES = Object.keys(PANES) as PaneName[];
export type PaneName = keyof typeof PANES;