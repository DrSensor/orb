import {
  $data,
  defineProperties,
  isFunction,
  iterator,
  O,
  toPrimitive,
} from "./_internal.js";

export const sequential = (effects) => [, effects];
export const concurrent = async (effects) =>
  (await Promise.allSettled(effects)).map(O.values);

export default function Orb(
  self,
  effectResolver = sequential,
  afterEffectResolver = effectResolver,
) {
  const get = () => orb[$data], // get current orb value
    orb = (transform) => cascade((set) => (value) => set(transform(value))), // cascading transformed orb
    set = (value) => ( // change current orb value
      orb[$data] !== value && effect(value), orb[$data] = value
    );

  let onchange, errors;
  const context = this ?? {},
    effects = new Set(), // PERF: beware of dangling object (unused memory)
    throwAll = (e) => errors.forEach((reject) => reject(e));

  const effect = async (value) => {
    const errorPool = [], queueError = (e) => errorPool.push(e);
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
    const orb$ = Orb.call(context, orb[$data]);
    effects.add(mkEffect(orb$.set));
    return defineProperties(orb$, { inherit: { value: orb } });
  };

  orb[$data] = self;
  return defineProperties(orb, {
    effect: { get: () => effects, set: (cb) => onchange = cb },
    initial: { value: self },
    let: { set, get },
    set: { value: set },
    [toPrimitive]: { value: get },
    then: { // await orb effect before returning current orb value
      value(r) { // it's possible to do `await orb.then(value)` to await orb effect then change current orb value
        const isGet = isFunction(r), resolve = isGet ? r : () => orb[$data] = r;
        return effect(isGet ? orb[$data] : r).then(resolve);
      },
    },
    catch: { value: (reject) => (errors ??= new Set()).add(reject) },
    [iterator]: { // cascading orb
      *value() {
        yield cascade((set) => set);
      },
    },
  });
}
