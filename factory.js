const { defineProperties } = Object, { iterator } = Symbol;
const isFunction = ($) => typeof $ == "function", create = {};

// keep the function.name anonymous
create.orb = (self) => {
  const orb = (...$) => {
    const [$1] = $;
    if (isFunction($1)) { // cascading transformed orb
      return cascade((orb$) => (value) => orb$($1(value)));
    } else { // set/get orb
      if ($.length && self !== $1) {
        self = $1;
        const finalize = orb.onchange?.(self), after = [];
        for (const effect of orb.effect) after.push(effect(self));
        for (const finalize of after) if (isFunction(finalize)) finalize();
        finalize?.();
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
    [iterator]: { // cascading orb
      *value() {
        yield cascade((orb$) => orb$);
      },
    },
  });
};

export default create.orb;
