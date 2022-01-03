import * as test from "./_shared.spec.js";

context("reactive Derivation", () => {
  it("can't be set");
  it("doesn't expose .let properties");

  describe("derivation", () => {
    it("can be from reactive value");
    it("can't be from promise or async function");
    it("can be without reactive value");
  });

  test.cascading();
  test.mode({
    sequential: () => {},
    concurrent: () => {},
    failFast: () => {},
    faultTolerant: () => {},
  });
});
