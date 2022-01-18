// TODO: refactor to _internal.js
const isExtensible = (val) => isFunc(val) || typeof val == "object",
  isFunc = (val) => typeof val == "function",
  // RUNTIME = __DEV__ ? 8 : JSX_AUTOMATIC_RUNTIME ? 6 : 4,
  // runtime = ($) => typeof ($ = $[RUNTIME]) == "function" ? $ : {};
  runtime = ($) => typeof ($ = $.at(-1)) == "function" ? $ : {};

// const $this = Symbol.for("this") // TODO: refactor  to _internal.js as unique Symbol()
export default (element, props, children, ...$) => (
  children = element.apply(
    $ = runtime($),
    [props ?? undefined] // `[{ value } = {}] = [null]` cause TypeError while `[undefined]` not
      .concat(children), // BUG:👆 on any classic JSX transformer which do `createElement(Component, null)`
  ),
    props = isExtensible(children)
      ? children
      : { [Symbol.toPrimitive]: () => children },
    isFunc($) ? [props, $, element] : props
);
