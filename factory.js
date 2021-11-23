const { defineProperties } = Object, S = Symbol;
const isFunction = ($) => typeof $ == "function";

Orb[S.hasInstance] = (instance) => instance.constructor == Orb;
export default function Orb(self) {
  const get = () => self, // get current orb value
    orb = (transform) => cascade((set) => (value) => set(transform(value))), // cascading transformed orb
    set = (value) => { // change current orb value
      if (self !== value) effect(value);
      return self = value;
    };

  let onchange;
  const context = this ?? {}, effects = new Set();

  const effect = async (value) => {
    const finalize = await onchange?.call(context, value), after = [];
    for await (let effect of effects) {
      if (isFunction(effect = effect.call(context, value))) after.push(effect);
    }
    for await (const effect of after) effect();
    await finalize?.();
    return value;
  };

  const cascade = (mkEffect) => {
    const orb$ = Orb.call(context, self);
    effects.add(mkEffect(orb$.set));
    return defineProperties(orb$, { inherit: { value: orb } });
  };

  return defineProperties(orb, {
    effect: { get: () => effects, set: (cb) => onchange = cb },
    initial: { value: self },
    value: { set, get },
    set: { value: set },
    [S.toPrimitive]: { value: get },
    constructor: { value: Orb },
    then: { // await orb effect before returning current orb value
      value(r) { // it's possible to do `await orb.then(value)` to await orb effect then change current orb value
        const isGet = isFunction(r), resolve = isGet ? r : () => self = r;
        return effect(isGet ? self : r).then(resolve);
      },
    },
    [S.iterator]: { // cascading orb
      *value() {
        yield cascade((set) => set);
      },
    },
  });
}
