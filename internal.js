const { defineProperties } = Object, { iterator } = Symbol;

[Boolean, Number, String, BigInt].forEach(({ prototype: $ }) =>
  defineProperties($, {
    [iterator]: {
      value: function* () {
        let self = this;
        const orb = defineProperties(
          (...$) => {
            const [$1] = $;
            if (typeof $1 == "function") { // cascading transformed orb
              return cascade((orb$) => (value) => orb$($1(value)));
            } else { // set/get orb
              if ($.length) {
                const finalize = orb.onchange?.(self = $1), after = [];
                for (const effect of orb.effect) after.push(effect(self));
                while (after.length) after.shift()?.();
                finalize?.();
              }
              return self;
            }
          },
          {
            effect: { value: new Set() },
            initial: { value: this },
            value: { set: orb, get: orb },
            [iterator]: function* () { // cascading orb
              yield cascade((orb$) => orb$);
            },
          },
        );
        const cascade = (mkEffect) => {
          const [orb$] = $[iterator].apply(self); // BUG: seems it only able to cascade one level 🤔
          orb.effect.add(mkEffect(orb$));
          return defineProperties(orb$, { inherit: { value: orb } });
        };
        yield orb;
      },
    },
  })
);
