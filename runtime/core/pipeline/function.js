const { defineProperty } = Object;
export default (element, props, children, runtime) =>
  typeof element == "function" &&
  ((effects) =>
    defineProperty(
      element.apply(
        defineProperty(runtime, "effect", {
          set(fn) {
            (effects ??= new Set()).add(fn);
          },
        }),
        [props].concat(children),
      ),
      "flush",
      {
        value() {
          effects?.forEach((effect) => effect.call(runtime, element));
          effects = null;
        },
      },
    ))();
