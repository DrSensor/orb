const { defineProperty, isExtensible } = Object;
export default (element, props, children, runtime) =>
  typeof element == "function" &&
  ((effects) =>
    defineProperty(
      (
        children = element.apply(
          defineProperty(runtime, "effect", {
            set(fn) {
              (effects ??= new Set()).add(fn);
            },
          }),
          [props].concat(children),
        ),
          isExtensible(children)
            ? children
            : { [Symbol.toPrimitive]: () => children }
      ),
      "flush",
      {
        value() {
          effects?.forEach((effect) => effect.call(runtime, element));
          // TODO:on dispose:require ref to be implemented: for (const effect of afterEffects) effect.call(runtime, element);
          effects = null;
        },
      },
    ))();
