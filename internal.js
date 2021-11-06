const { defineProperties } = Object, noop = (_) => {}, id = Symbol();
export const isFunction = ($) => typeof $ == "function";

[Number, String].forEach(({ prototype: $ }) =>
  defineProperties($, {
    [Symbol.iterator]: {
      value: function* () {
        let self = this, onchange = noop;
        const react = [];
        const orb = defineProperties(
          (...$) => {
            if ($.length) {
              const finalize = onchange(self = $[0]), after = [];
              react.forEach((effect) => after.push(effect(self)));
              while (after.length) after.shift()?.();
              finalize?.();
            }
            return self;
          },
          {
            reset: { value: () => orb(this) },
            value: { set: orb, get: orb },
            unbind: {
              value: ($) => {
                const { length } = react;
                isFunction($)
                  ? react.splice(react.findIndex((cb) => cb[id] == $[id]), 1)
                  : react.splice($ > 0 ? $ - 1 : length, 1);
                return length;
              },
            },
            onchange: {
              set: (cb) => onchange = isFunction(cb) ? cb : noop,
              get: () => (cb) => isFunction(cb) ? cb[id] = react.push(cb) : 0,
            },
          },
        );
        yield orb;
      },
    },
  })
);
