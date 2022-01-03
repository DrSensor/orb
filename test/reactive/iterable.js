context("reactive Iterable", () => {
  it("can't have index");
  specify("every destructured value is reactive");
  specify("every iterated value (from `for..of`) is reactive");
  specify("every item with typeof object is not reactive");
  specify("every item with typeof object can be transformed beforehand");

  describe("built-in object transformation", () => {
    specify("`depth(Infinity)`");
    specify("`flatten(Infinity)`");
    specify("`flatten(2) |> depth(Infinity, %)`");
  });
});
