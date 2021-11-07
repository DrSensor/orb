const { defineProperties } = Object, { iterator } = Symbol;
const isFunction = ($) => typeof $ == "function";

[Boolean, Number, String, BigInt].forEach(({ prototype: $ }) =>
  defineProperties($, {
    [iterator]: {
      *value() {
        let self = this;
        const orb = (...$) => {
          const [$1] = $;
          if (isFunction($1)) { // cascading transformed orb
            return cascade((orb$) => (value) => orb$($1(value)));
          } else { // set/get orb
            if ($.length) {
              self = $1;
              const finalize = orb.onchange?.(self), after = [];
              for (const effect of orb.effect) after.push(effect(self));
              for (const finalize of after) isFunction(finalize) && finalize();
              finalize?.();
            }
            return self;
          }
        };
        defineProperties(orb, {
          effect: { value: new Set() },
          initial: { value: this },
          value: { set: orb, get: orb },
          [iterator]: { // cascading orb
            *value() {
              yield cascade((orb$) => orb$);
            },
          },
        });
        const cascade = (mkEffect) => {
          const [orb$] = $[iterator].apply(self);
          orb.effect.add(mkEffect(orb$));
          return defineProperties(orb$, { inherit: { value: orb } });
        };
        yield orb;
      },
    },
  })
);
