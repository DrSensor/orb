export const TOPLEVEL = 2, AUTOMATIC = 1, CLASSIC = 0;
export default (mode, ...jsxFactories) =>
  (element, props, ...args) => {
    const runtime = {}, call = {}, after = [];
    if (mode) {
      var { children = [], ...props } = props;
      children = Array.isArray(children) ? children : [children];
    } else children = args;

    args = [Object.entries(props ?? {}), children, runtime, args];
    for (let create of jsxFactories) {
      var result = create.apply(call, [element].concat(args)) ?? element;
      if (typeof (create = call.effect?.()) == "function") after.push(create);
      if (result) break; // call.prev = result; // WARNING: it still unknown how to automatically free(call.prev)
    }
    for (const effect of after) effect?.();
    return result;
  }; // 👈 effect Map should be evicted here
