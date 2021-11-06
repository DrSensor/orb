const { defineProperties } = Object, noop = (_) => {};
export const isFunction = ($) => typeof $ == "function";

[Number, String].forEach(({ prototype: $ }) =>
  defineProperties($, {
    [Symbol.iterator]: {
      value: function* () {
        let self = this, onchange = noop;
        const react = new Set();
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
            unbind: { value: (cb) => react.delete(cb) && react.size },
            onchange: {
              set: (cb) => onchange = isFunction(cb) ? cb : noop,
              get: () => (cb) => isFunction(cb) && react.add(cb) && cb,
            },
          },
        );
        yield orb;
      },
    },
  })
);
