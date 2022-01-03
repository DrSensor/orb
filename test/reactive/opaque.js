context("Opaque value", () => {
  const testBehaviour = () => {
    it("can't have side effects");
    it("can accept function as a value");
    describe("function as value", () => {
      it("can't be set or get");
      it("setter and getter can be overrided");
    });
  };

  context("default", () => {
    it("value can be set or get");
    it("setter and getter can be overrided");
    testBehaviour();
  });

  context("set-only", () => {
    it("value can be set");
    it("shouldn't have getter");
    it("can have custom getter");
    it("setter can be overrided");
    testBehaviour();
  });

  context("get-only", () => {
    it("value can be get");
    it("shouldn't have setter");
    it("can have custom setter");
    it("getter can be overriden");
    testBehaviour();
  });

  context("incomplete", () => {
    it("shouldn't have setter");
    it("shouldn't have getter");
    it("can have custom setter");
    it("can have custom getter");
    testBehaviour();
  });
});
