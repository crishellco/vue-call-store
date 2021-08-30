import optimizeLodashImports from 'rollup-plugin-optimize-lodash-imports';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import vue from 'rollup-plugin-vue';
import { terser } from 'rollup-plugin-terser';
import autoExternal from 'rollup-plugin-auto-external';

import packageJson from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      exports: 'named',
      format: 'cjs',
      file: packageJson.main,
      sourcemap: true
    },
    {
      exports: 'named',
      format: 'esm',
      file: packageJson.module,
      sourcemap: true
    }
  ],
  plugins: [
    autoExternal(),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    vue(),
    optimizeLodashImports(),
    terser()
  ]
};
