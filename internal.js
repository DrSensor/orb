const { defineProperties } = Object, noop = (_) => {}, { iterator } = Symbol;
export const isFunction = ($) => typeof $ == "function";

[Boolean, Number, String, BigInt].forEach(({ prototype: $ }) =>
  defineProperties($, {
    [iterator]: {
      value: function* () {
        let self = this, onchange = noop;
        const react = new Set();
        const orb = defineProperties(
          (...$) => {
            const [$1] = $;
            if (isFunction($1)) { // cascading transformed orb
              const [orb$] = $[iterator].apply(self);
              react.add((value) => orb$($1(value)));
              return orb$;
            } else {
              if ($.length) {
                const finalize = onchange(self = $1), after = [];
                react.forEach((effect) => after.push(effect(self)));
                while (after.length) after.shift()?.();
                finalize?.();
              }
              return self;
            }
          },
          {
            reset: { value: () => orb(this) },
            value: { set: orb, get: orb },
            unbind: { value: (cb) => react.delete(cb) && react.size },
            onchange: {
              set: (cb) => onchange = isFunction(cb) ? cb : noop,
              get: () => (cb) => isFunction(cb) && react.add(cb) && cb,
            },
            [iterator]: function* () { // cascading orb
              const [orb$] = $[iterator].apply(self);
              react.add(orb$);
              yield orb$;
            },
          },
        );
        yield orb;
      },
    },
  })
);
