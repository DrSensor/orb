window.esmsInitOptions = {
  shimMode: true,
  noLoadEventRetriggers: true,
  revokeBlobURLs: true,
  skip: /^https?:\/\/(cdn\.skypack\.dev|jspm\.dev|ga\.jspm\.io|esm\.sh)\//,
};

import("https://esm.sh/es-module-shims/wasm");
