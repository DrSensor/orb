export const TOPLEVEL = 2, AUTOMATIC = 1, CLASSIC = 0;
export default (mode, ...jsxFactories) =>
  (element, props, ...args) => {
    const runtime = {}, call = {}, after = [];
    if (mode) {
      var { children, ...props } = props;
      children = children[Symbol.iterator] ? children : [children];
    } else children = args;

    args = [props].concat(children, runtime, args);
    for (let create of jsxFactories) {
      element = create.apply(call, [element].concat(args)) ?? element;
      if (typeof (create = call.effect?.()) == "function") after.push(create);
    }
    for (const effect of after) effect?.();
    return element;
  }; // 👈 effect Map should be evicted here
