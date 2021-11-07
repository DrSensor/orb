const { defineProperties } = Object, { iterator } = Symbol;

const inherit = (child, parent) =>
  defineProperties(child, { inherit: { value: parent } });

[Boolean, Number, String, BigInt].forEach(({ prototype: $ }) =>
  defineProperties($, {
    [iterator]: {
      value: function* () {
        let self = this;
        const orb = defineProperties(
          (...$) => {
            const [$1] = $;
            if (typeof $1 == "function") { // cascading transformed orb
              const [orb$] = $[iterator].apply(self);
              orb.effect.add((value) => orb$($1(value)));
              return inherit(orb$, orb);
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
              const [orb$] = $[iterator].apply(self);
              orb.effect.add(orb$);
              yield inherit(orb$, orb);
            },
          },
        );
        yield orb;
      },
    },
  })
);
