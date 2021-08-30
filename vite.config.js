import path from 'path';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';

export default defineConfig({
  plugins: [createVuePlugin()],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'MyLib',
      fileName: format => `vue-call-store.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'vuex', 'dayjs'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: { vue: 'Vue', dayjs: 'dayjs', vuex: 'Vuex' }
      }
    }
  }
});
