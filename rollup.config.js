import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'

import pkg from './package.json'

const entries = [
  'src/index.ts',
  'src/bin.ts',
]

const dtsEntries = [
  'src/index.ts',
]

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]

const plugins = [
  resolve({
    preferBuiltins: true,
  }),
  json(),
  commonjs(),
  esbuild({
    target: 'node14',
  }),
]

export default ({ watch }) => [
  {
    input: entries,
    output: {
      dir: 'dist',
      format: 'esm',
      sourcemap: 'inline',
    },
    external,
    plugins,
    onwarn(message) {
      if (/Circular dependencies/.test(message))
        return
      console.error(message)
    },
  },
  ...dtsEntries.map(input => ({
    input,
    output: {
      file: input.replace('src/', 'dist/').replace('.ts', '.d.ts'),
      format: 'esm',
    },
    external,
    plugins: [
      dts({ respectExternal: true }),
    ],
  })),
]
