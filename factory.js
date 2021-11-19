const { defineProperties } = Object;
const isFunction = ($) => typeof $ == "function";

export default function Orb(self) {
  const orb = (...$) => {
    const [$1] = $;
    if (isFunction($1)) { // cascading transformed orb
      return cascade((orb$) => (value) => orb$($1(value)));
    } else { // set/get orb
      if ($.length) {
        if (self !== $1) effect($1);
        self = $1;
      }
      return self;
    }
  };

  let onchange;
  const context = this ?? {}, effects = new Effect(context);
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
    effects.add(mkEffect(orb$));
    return defineProperties(orb$, { inherit: { value: orb } });
  };

  return defineProperties(orb, {
    effect: { get: () => effects, set: (cb) => onchange = cb },
    initial: { value: self },
    value: { set: orb, get: orb },
    [Symbol.toPrimitive]: { value: () => self },
    then: {
      value(r) {
        const get = isFunction(r), resolve = get ? r : () => self = r;
        return effect(get ? self : r).then(resolve);
      },
    },
    [Symbol.iterator]: { // cascading orb
      *value() {
        yield cascade((orb$) => orb$);
      },
    },
  });
}

class Effect extends Set {
  constructor(context) {
    super();
    this.add = (item) => {
      this.onadd?.(context);
      return super.add(item);
    };
    this.delete = (item) => {
      this.ondelete?.(context);
      return super.delete(item);
    };
  }
}
