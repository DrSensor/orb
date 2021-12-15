import {
  $data,
  defineProperties,
  isFunction,
  iterator,
  toPrimitive,
} from "./_internal.js";

export const sequential = (effects) => effects;
export const concurrent = async (effects) =>
  (await Promise.allSettled(effects)).map((a) => a.value);

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

  let onchange;
  const context = this ?? {}, effects = new Set(); // PERF: beware of dangling object (unused memory)

  const effect = async (value) => {
    const finalize = await onchange?.call(context, value), after = [];
    for await (let effect of await effectResolver(effects)) {
      if (isFunction(effect = effect.call(context, value))) after.push(effect);
    }
    for await (const effect of await afterEffectResolver(after)) effect();
    await finalize?.();
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
    [iterator]: { // cascading orb
      *value() {
        yield cascade((set) => set);
      },
    },
  });
}
