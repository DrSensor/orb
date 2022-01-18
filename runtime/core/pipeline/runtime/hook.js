const { keys } = Object; // TODO: refactor to _internal.js
export default (...$) =>
  $.concat(((runtime = (hook, args = [], ...extras) => {
    runtime.this = [];
    const result = hook.apply(
        (hook = runtime.bind(), hook.args = [args].concat(extras), hook),
        args,
      ),
      give = (result) => (
        delete hook.args, keys(hook).length && runtime.this.push(hook), result
      );
    return result instanceof Promise ? result.then(give) : give(result);
  }) => runtime)());
