import { defineProperties, iterator } from "./_internal.js";

/** @deprecated */
export const INHERIT = 1;

/** @deprecated */
export const enableCascading = (obj, handler, withInherit) =>
  defineProperties(obj, {
    [iterator]: {
      *value() {
        const value = handler(this);
        if (withInherit) defineProperties(value, { inherit: { value: obj } });
        yield value;
      },
    },
  });
