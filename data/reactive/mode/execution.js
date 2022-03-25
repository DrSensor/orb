const A = Array, O = Object, P = Promise; // TODO:👈👇 refactor to _internal.js
const { assign } = O,
  { all: promiseAll, allSettled: promiseAllSettled } = P,
  then = (promise, microtask) => promise.then(microtask),
  reject = (promise, microtask) => promise.catch(microtask),
  chainPromise = (promise, ...microtasks) => (
    forEach(microtasks, (task) => promise = promise.then(task)), promise
  ),
  isFunction = ($) => typeof $ == "function",
  isAsync = ($) => $ instanceof P,
  forEach = (array, callback) => array.forEach(callback),
  push = (array, item) => array.push(item),
  apply = (fn, context, args) => fn.apply(context, args),
  passthru = ($) => $;
const S = Symbol, // TODO:👈👇 refactor to _symbol.js
  { iterator } = S,
  resolver = /* @__PURE__ */ S(),
  resolver$effect = /* @__PURE__ */ S(),
  resolver$error = /* @__PURE__ */ S();

let defaultMode;
export const setDefaultMode = (mode) => defaultMode = mode;

/** sync then switch to async when encounter async effect()
 * @returns Promise<any> */
export const auto = (
  preResolver = passthru,
  postResolver = preResolver,
) =>
  preResolver[resolver$error]
    ? preResolver(auto)
    : (preResolver = preResolver[resolver$effect] ?? preResolver,
      postResolver = postResolver[resolver$effect] ?? postResolver,
      assign((
        onchange,
        effect,
        value,
        _reject,
        _errors,
        run = apply,
        context = {},
        after = [],
      ) =>
        async (...$) => {
          let finalize = run(onchange, context, $);
          if (isAsync(finalize)) finalize = await finalize;
          for (
            effect of isAsync(effect = preResolver(effect))
              ? await effect
              : effect
          ) {
            push(
              after,
              effect = isAsync(effect = run(effect, context, $))
                ? await effect
                : effect,
            );
          }
          value = after.length || finalize ? value() : $[0];
          for (
            effect of isAsync(after = postResolver(after)) ? await after : after
          ) {
            if (isAsync(effect = effect(value))) await effect;
          }
          if (
            isFunction(finalize = isAsync(finalize) ? await finalize : finalize)
          ) {
            finalize(value);
          }
          return value;
        }, { [resolver]: [preResolver, postResolver] }));

/** @param resolver can't be concurrent */
export const sync = (
  preResolver = passthru,
  postResolver = preResolver,
) =>
  preResolver[resolver$error]
    ? preResolver(sync)
    : (preResolver = preResolver[resolver$effect] ?? preResolver,
      postResolver = postResolver[resolver$effect] ?? postResolver,
      assign((
        onchange,
        effect,
        value,
        _reject,
        _errors,
        run = apply,
        context = {},
        after = [],
      ) =>
        (...$) => {
          context ??= {};
          const finalize = run(onchange, context, $);
          for (effect of preResolver(effect)) {
            push(after, effect = run(effect, context, $));
          }
          value = after.length || finalize ? value() : $[0];
          for (effect of postResolver(after)) effect(value);
          if (isFunction(finalize)) finalize(value);
          return value;
        }, { [resolver]: [preResolver, postResolver] }));

export const async = (
  preResolver = passthru,
  postResolver = preResolver,
) =>
  preResolver[resolver$error]
    ? preResolver(async)
    : (preResolver = preResolver[resolver$effect] ?? preResolver,
      postResolver = postResolver[resolver$effect] ?? postResolver,
      assign((
        onchange,
        effect,
        value,
        _reject,
        _errors,
        run = apply,
        context = {},
        after = [],
      ) =>
        async (...$) => {
          context ??= {};
          let finalize = await run(onchange, context, $);
          for await (effect of await preResolver(effect)) {
            push(after, effect = run(effect, context, $));
          }
          value = after.length || finalize ? value() : $[0];
          for await (effect of await postResolver(after)) effect(value);
          if (isFunction(finalize = await finalize)) finalize(value);
          return value;
        }, {
        [resolver]: [preResolver, postResolver],
      }));

const func = (fn, type, value = 1) => (fn[type] = value, fn),
  resolve = (mode) => mode[resolver] ? mode : mode(),
  build = (mode, vars) => resolve(mode)(...vars),
  override = (mode, builder) => assign(builder, mode),
  trycatch = (run, $, reject) => {
    try {
      run(...$); // run all effect in specific mode
    } catch (error) {
      reject(error); // pass error to reject() in reactive.catch(reject: error => void)
    }
  };

/** @param mode can't be sync */
export const concurrent = /* @__PURE__ */ func(
  (mode = defaultMode) => resolve(mode)(promiseAll),
  resolver$effect,
  promiseAll,
);
export const sequential = /* @__PURE__ */ func(
  (mode = defaultMode) => resolve(mode)(passthru),
  resolver$effect,
  passthru,
);

export const failfast = /* @__PURE__ */ func(
  (mode = defaultMode) =>
    override(mode, (...vars) => (
      mode = build(mode, vars), (...$) => trycatch(mode, $, vars[3])
    )),
  resolver$error,
);

export const robust = /* @__PURE__ */ func(
  (mode = defaultMode) =>
    override(mode, (...vars) => {
      const pool = [],
        queue = (error) => push(pool, error),
        flush = vars[3] = () => { // drop all errors in the stack vars[4]
          if (pool.length) {
            forEach(
              vars[4],
              (reject) => forEach(pool, (error) => reject(error)),
            );
          }
        },
        [effectResolver, afterEffectResolver] = mode[resolver] ?? [],
        robustResolver = (effects) =>
          then(promiseAllSettled(effects), (results) => ({
            *[iterator]() {
              for (const { reason, value } of results) {
                reason ? queue(reason) : yield value;
              }
            },
          }));
      if (effectResolver == promiseAll) vars[1] = robustResolver(vars[1]);
      if (afterEffectResolver == promiseAll) vars[7] = robustResolver(vars[7]);
      vars[5] = (...$) => trycatch(apply, $, queue); // try { apply(effect, context, args) } catch(error) { queue(error) }
      mode = build(mode, vars);
      return (...$) => (isAsync(mode = mode(...$))
        ? mode = then(mode, (it) => (flush(), it))
        : flush(),
        mode);
    }),
  resolver$error,
);
