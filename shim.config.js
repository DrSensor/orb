import { clone, combine, merge } from "./utils/config.js";
import { importResolve, importTransform } from "./utils/hooks.js";

const jsconfig = { ext: ".mjs", skip: true },
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
    sourceMaps: true,
    inlineSourcesContent: false,
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
  skip: /^https?:\/\/(cdn\.)?((skypack|jspm)\.dev|esm\.sh)\//,
  // resolve: importResolve("esm.sh"),
  fetch: importTransform({ // NOTE: mostly non .js extension like .jsx .ts .tsx not served with header Content-Type: text/javascript
    // subtype: "javascript",
    basename: /\.(jsx|tsx?)$/, // optional fallback if subtype fail
    transform: (source, config, { jsx }, url) => {
      if (jsx) merge((config = clone(config)).jsc.transform.react, jsx);
      let { code, map } = swc.transformSync(source, config);
      code += `\n//# sourceMappingURL=data:,${
        map.replace(/<anon>/, url).replace(/\s/g, "") // WARNING: this solution might be specifc to swc.rs
      }`;
      return code;
    },
    rules: [jsconfig, jsxconfig, tsconfig, tsxconfig],
  }),
};

import * as swc from "https://esm.sh/@swc/wasm-web";
// TODO: remove this👇 hard coded url when https://github.com/alephjs/esm.sh/issues/233 fixed
swc.default("https://esm.sh/@swc/wasm-web/wasm_bg.wasm").then(() => {
  // sourceMapSupport.install(); // BUG: sourceMapSupport doesn't properly resolve error stack trace to sourceMapURL
  import("https://esm.sh/es-module-shims/wasm");
});

// TODO: support both babel and swc via URL params (e.g import("./test/a.jsx?babel"))
// import Babel from "https://esm.sh/@babel/standalone";

// TODO: support both esbuild and swc via URL params (e.g import("./test/a.jsx?esbuild"))
// import esbuild from "https://esm.sh/esbuild-wasm";

// TODO: integrate power-assert
// currently importing babel-preset-power-assert via esm.sh will fail
// due to babel-plugin-espower importing "fs" builtin node module
// currently esm.sh doesn't support this https://github.com/alephjs/esm.sh/issues/212#issuecomment-966042429 (only in browser but works on deno)
// but...
// I think it's better to write (or use existing if any)
// 😎 SWC plugin for power-assert 😎
// without using any builtin node modules (e.g fs, path, ...)
// It doesn't mean replacing the current assertion library
// since power-assert in here is to pinpoint some bug testing that need verbose error diagnostics
// power-assert not used in a test that only require simple diagnostics
