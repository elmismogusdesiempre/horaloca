import {defineConfig} from 'vite';
import {resolve} from 'node:path';
export default defineConfig({build:{rollupOptions:{input:{guest:resolve('index.html'),organizer:resolve('organizador.html')}}}});
