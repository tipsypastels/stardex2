import { setup } from 'svelte-match-media';

setup({
  tablet: 'screen and (min-width: 768px)',
});

import App from './App.svelte';
export default new App({ target: document.body });