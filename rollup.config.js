import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default [
  // megvii-http
  {
    input: 'lib/index.js',
    output: [
      {
        exports: 'named',
        file: 'dist/megvii-http.esm.js',
        format: 'esm'
      },
      {
        name: 'megvii-http',
        exports: 'named',
        file: 'dist/megvii-http.umd.js',
        format: 'umd',
        globals: {
          axios: 'axios'
        }
      }
    ],
    external: ['axios'],
    plugins: [
      resolve(),
      commonjs(),
      json(),
      babel({
        runtimeHelpers: true,
        exclude: 'node_modules/**'
      }),
      terser({
        include: [/umd\.js$/]
      })
    ]
  }
];
