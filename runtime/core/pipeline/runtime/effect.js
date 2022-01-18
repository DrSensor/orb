const { defineProperty } = Object; // TODO: refactor to _internal.js
export default (element, runtime, Component) =>
  element[$flush] ? element : defineProperty(element, $flush, {
    value() {
      runtime.effect?.call(runtime, Component); // inside <Component />
      if (runtime.this) { // inside this(hook)
        for (const { effect } of runtime.this) effect?.call(runtime, Component);
      }
      // TODO:on dispose:require ref to be implemented: for (const effect of afterEffects) effect.call(runtime, element);
    },
  });

const $flush = Symbol();
export const flush = (children) =>
  children.forEach(({ [$flush]: flush }) => flush?.());
