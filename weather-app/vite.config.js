import { defineConfig } from 'vite'
import TurboConsole from 'unplugin-turbo-console/vite';

export default defineConfig({
    build:{
      target: "esnext",
    },
    plugins: [TurboConsole({
        // options for turboconsole here.
    })]
  });