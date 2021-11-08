const { defineProperties } = Object, { iterator, toPrimitive } = Symbol;
const isFunction = ($) => typeof $ == "function", create = {};

// keep the function.name anonymous
create.orb = (self) => {
  const orb = (...$) => {
    const [$1] = $;
    if (isFunction($1)) { // cascading transformed orb
      return cascade((orb$) => (value) => orb$($1(value)));
    } else { // set/get orb
      if ($.length) {
        queueMicrotask(() => {
          if (self !== $1) {
            const finalize = orb.onchange?.($1), after = [];
            for (const effect of orb.effect) after.push(effect($1));
            for (const effect of after) if (isFunction(effect)) effect();
            finalize?.();
          }
        });
        self = $1;
      }
      return self;
    }
  };

  const cascade = (mkEffect) => {
    const orb$ = create.orb(self);
    orb.effect.add(mkEffect(orb$));
    return defineProperties(orb$, { inherit: { value: orb } });
  };

  return defineProperties(orb, {
    effect: { value: new Set() },
    initial: { value: self },
    value: { set: orb, get: orb },
    [toPrimitive]: { value: () => self },
    [iterator]: { // cascading orb
      *value() {
        yield cascade((orb$) => orb$);
      },
    },
  });
};

export default create.orb;
