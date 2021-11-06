const { defineProperties } = Object, noop = (_) => {}, id = Symbol();
const isFunction = ($) => typeof $ == "function";

[Number, String].forEach(({ prototype: $ }) =>
  defineProperties($, {
    [Symbol.iterator]: {
      value: function* () {
        let self = this, onchange = noop;
        const orb = defineProperties(
          (...$) => {
            if ($.length) {
              onchange(self = $[0]);
            }
            return self;
          },
          {
            reset: { value: () => orb(this) },
            value: { set: orb, get: orb },
            onchange: {
              set: (cb) => onchange = isFunction(cb) ? cb : noop,
            },
          },
        );
        yield orb;
      },
    },
  })
);
