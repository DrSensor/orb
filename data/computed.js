import {
  defineProperties,
  isFunction,
  iterator,
  toPrimitive,
} from "./_internal.js";

import Orb, { sequential } from "./reactive.js";
export { concurrent, sequential } from "./reactive.js";

// TODO: refactor to reduce bundle size
// some function like effect() and cascade() are copy-paste from ./reactive.js
/** Perform pull-based reactive computation
 TODO: move this JSDoc example to types/computed.d.ts or test/computed.js file
 * @example
 * const [b] = 1, [c] = 2, a = computed(_ => _(b) + c)
 * let d = 0
 * assert(3 === +a); a.effect = a => d = +a
 * b.let += 10; assert(13 == +a && d == 13) // d is updated since b is linked via `_(b)`
 * c.let += 10; assert(23 == +a && d == 13) // no change in d because c is not linked
 */
export default function (
  compute,
  effectResolver = sequential,
  afterEffectResolver = effectResolver,
) {
  const get = () => compute.call(context, link, unlink),
    orb = (transform) => cascade((set) => () => set(transform(get()))), // cascading transformed orb
    link = (orb) => (orb.effect.add(effect), orb),
    unlink = (orb) => (orb.effect.delete(effect), orb);

  let onchange, errors;
  const context = this ?? {},
    effects = new Set(), // PERF: beware of dangling object (unused memory)
    throwAll = (e) => errors.forEach((reject) => reject(e));

  const effect = async () => {
    const value = get(), errorPool = [], queueError = (e) => errorPool.push(e);
    try {
      let status, effect;
      const isError = () => errors && status === "rejected";
      const finalize = await onchange?.call(context, value), after = [];
      for await ([status, effect] of await effectResolver(effects)) {
        isError()
          ? queueError(effect)
          : isFunction(effect = effect.call(context, value)) &&
            after.push(effect);
      }
      for await ([status, effect] of await afterEffectResolver(after)) {
        isError() ? queueError(effect) : effect();
      }
      await finalize?.();
    } catch (error) {
      throwAll(error);
    }
    errorPool.length > 0 && throwAll(errorPool);
    return value;
  };

  const cascade = (mkEffect) => {
    const orb$ = Orb.call(context, get());
    effects.add(mkEffect(orb$.set));
    return defineProperties(orb$, { inherit: { value: get } });
  };

  return defineProperties(orb, {
    effect: { get: () => effects, set: (cb) => onchange = cb },
    [toPrimitive]: { value: get },
    then: { value: (resolve) => effect().then(resolve) }, // execute then await all effects before returning computed value
    catch: { value: (reject) => (errors ??= new Set()).add(reject) },
    [iterator]: { // cascading orb
      *value() {
        yield cascade((set) => set);
      },
    },
  });
}
