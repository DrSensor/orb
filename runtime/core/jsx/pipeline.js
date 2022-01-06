export const TOPLEVEL = 2, AUTOMATIC = 1, CLASSIC = 0;
export default (mode, ...jsxFactories) =>
  (element, props, ...args) => {
    const runtime = (hook, args = [], ...extras) => {
      runtime.args = args.concat(extras);
      const result = hook.apply(runtime, args),
        give = (result) => (
          runtime.args = null, delete runtime.args, result
        );
      return result instanceof Promise ? result.then(give) : give(result);
    };

    if (mode) {
      var { children = [], ...props } = props;
      children = Array.isArray(children) ? children : [children];
    } else children = args;

    args = [element, Object.entries(props ?? {}), children, runtime, args];
    return new execute(jsxFactories, args);
  };

export function only(predicate, ...jsxFactories) {
  const context = this;
  return (...args) =>
    predicate(...args) && execute.call(context, jsxFactories, args);
}

function execute(jsxFactories, args) {
  for (const create of jsxFactories) {
    var result = create.apply(this, args) ?? args[0];
    if (result) break; // this.prev = result; // WARNING: it still unknown how to automatically free(this.prev)
  }
  return result;
}
