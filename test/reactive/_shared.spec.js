export { testCascading as cascading, testMode as mode };

export const testCascading = () => {
  context("cascading", () => {
    it("child value should follow parent value");
    const testBehaviour = () => {
      it("changing child value shouldn't affect parent value");
      it("changing parent value will execute effects in child");
    };
    testBehaviour();

    describe("with transformation", () => {
      it("value should derived from parent");
      it("can't be from promise or async function");
      testBehaviour();
    });
  });
};

export const testMode = (
  { sequential, concurrent, failFast, faultTolerant },
) => {
  describe("mode", () => {
    context("sequential", sequential);
    context("concurrent", concurrent);

    describe("submode", () => {
      context("fail-fast", failFast);
      context("fault-tolerant", faultTolerant);
    });
  });
};
