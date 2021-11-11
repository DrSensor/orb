import "https://esm.sh/mocha";

mocha.setup("tdd");

// This is equivalent to the above method.
mocha.setup({
  ui: "tdd",
});

// you should use "tdd" interface, check for global leaks, and then force all tests to be asynchronous
mocha.setup({
  ui: "tdd",
  checkLeaks: true,
  asyncOnly: true,
});
