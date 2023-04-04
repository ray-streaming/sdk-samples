import path from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: path.resolve(__dirname, './src/index.js'),
  output: {
    file: path.resolve(__dirname, './public/bundled.js'),
    format: 'iife',
    name: 'myBundle',
  },
  plugins: [nodeResolve(), commonjs()],
}
