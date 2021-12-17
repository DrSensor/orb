import test from "mocha";
test.setup({
  ui: "bdd",
  reporter: "html", // TODO: dogfooding by creating custom reporter like mochawesome but directly render to DOM
  checkLeaks: true,
  growl: true,
});

import "./reporter/clean-trace.js";
test.traceIgnores = [
  "config.js",
  "mocha.bundle.js",
  "referee.bundle.js",
];

await Promise.allSettled([
  // import("test/something.js")
]);

test.run();
