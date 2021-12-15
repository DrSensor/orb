import { $data, defineProperties, iterator } from "./_internal.js";

export const override = (orb, propertyDescriptor) =>
  defineProperties(orb, { [$data]: propertyDescriptor });

export const INHERIT = 1;
export const enableCascading = (orb, handler, withInherit) =>
  defineProperties(orb, {
    [iterator]: {
      *value() {
        const value = handler(this);
        if (withInherit) defineProperties(value, { inherit: { value: orb } });
        yield value;
      },
    },
  });
