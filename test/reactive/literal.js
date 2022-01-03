import * as test from "./_shared.spec.js";

context("reactive Literal value", () => {
  test.mode({
    sequential: () => {},
    concurrent: () => {},
    failFast: () => {},
    faultTolerant: () => {},
  });

  describe("effect execution of", () => {
    context("function", () => {
      describe("using `=` assignment", () => {});
      describe("using .add()", () => {});
    });
    context("async function", () => {
      describe("using `=` assignment", () => {});
      describe("using .add()", () => {});
    });
  });

  test.cascading();
});
