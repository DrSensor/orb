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
        effect($1);
        self = $1;
      }
      return self;
    }
  };

  const effect = async (value) => {
    if (self !== value) {
      const finalize = await orb.onchange?.(value), after = [];
      for await (const effect of orb.effect) after.push(effect(value));
      for await (const effect of after) if (isFunction(effect)) effect();
      await finalize?.();
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
    then: { value: (resolve) => effect.then(() => resolve(self)) },
    [iterator]: { // cascading orb
      *value() {
        yield cascade((orb$) => orb$);
      },
    },
  });
};

export default create.orb;
