import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias'; // 路径别名
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
const path = require('path');

const pkg = require('./package.json');
const isProduction = process.env.NODE_ENV === 'production';
const config = {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'umd', name: 'jsHunter', sourcemap: !!isProduction },
    { file: pkg.module, format: 'es', sourcemap: !!isProduction },
  ],
  watch: {
    include: 'src/**',
  },

  plugins: [
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs(),
    resolve(),
    alias({
      entries: {
        '@': path.resolve(__dirname, 'src'),
      },
    }),
  ],
};
if (isProduction) {
  config.plugins.push(sourceMaps());
  config.plugins.push(terser());
}

export default config;
