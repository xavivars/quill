import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import svg from "rollup-plugin-svg";
import postcss from "rollup-plugin-postcss";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import del from 'rollup-plugin-delete'

import pkg from "./package.json";

export default [{
  input: "quill.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true,
    },
  ],
  plugins: [
    postcss({
      extensions: [".css"],
    }),
    svg(),
    external(),
    resolve(),
    typescript(),
    commonjs({ extensions: [".js", ".ts"] }),
    injectProcessEnv({ env: { NODE_ENV: "dev" }})
  ],
},
  getStyle('snow'),
  getStyle('bubble')
];

function getStyle(theme) {
  return {
    input: `assets/${theme}.styl`,
    output: {
      file: `dist/quill.${theme}.js`,
      format: 'es'
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true,
      }),
      del({
          hook: 'closeBundle', 
          targets: `dist/quill.${theme}.js` 
      })
    ]
  }
}