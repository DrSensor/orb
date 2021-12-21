import { combine } from "./utils/config.js";
import { importResolve, importTransform } from "./utils/hooks.js";

const jsconfig = { ext: ".js", skip: true },
  jsxconfig = {
    ext: ".jsx",
    jsc: {
      parser: {
        syntax: "ecmascript",
        jsx: true,
      },
      transform: {
        react: {
          pragma: "createElement",
          pragmaFrag: "Fragment",
          importSource: "orb/runtime/web",
          throwIfNamespace: false,
          useBuiltins: true,
        },
      },
      target: "es2022",
    },
  },
  tsconfig = combine(jsxconfig, {
    ext: ".ts",
    jsc: {
      parser: { syntax: "typescript", jsx: undefined },
      transform: undefined,
    },
  }),
  tsxconfig = combine(tsconfig, {
    ext: ".tsx",
    jsc: {
      parser: { tsx: true },
      transform: jsxconfig.jsc.transform,
    },
  });

window.esmsInitOptions = {
  shimMode: true,
  noLoadEventRetriggers: true,
  revokeBlobURLs: true,
  skip: /^https?:\/\/(cdn\.skypack\.dev|jspm\.dev|ga\.jspm\.io|esm\.sh)\//,
  resolve: importResolve("esm.sh"),
  fetch: importTransform({ // NOTE: mostly non .js extension like .jsx .ts .tsx not served with header Content-Type: text/javascript
    // subtype: "javascript",
    basename: /\.(jsx|tsx?)$/, // optional fallback if subtype fail
    transform: (source, config) => swc.transformSync(source, config).code,
    rules: [/* jsconfig, */ jsxconfig, tsconfig, tsxconfig],
  }),
};

import * as swc from "https://esm.sh/@swc/wasm-web";
// TODO: remove this👇 hard coded url when https://github.com/alephjs/esm.sh/issues/233 fixed
swc.default("https://esm.sh/@swc/wasm-web/wasm_bg.wasm").then(() =>
  import("https://esm.sh/es-module-shims/wasm")
);
