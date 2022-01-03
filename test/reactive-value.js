const basePath = "/test/reactive/",
  tests = ["opaque", "literal", "derivation", "struct", "iterable"]
    .map((it) => import(basePath + it + ".js"));

await Promise.all(tests);
