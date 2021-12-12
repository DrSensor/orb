const { defineProperties } = Object, S = Symbol;

const $data = Symbol();
export default $data;

export const override = (orb, propertyDescriptor) =>
  defineProperties(orb, { $data: propertyDescriptor });

export const WITH_INHERIT = 1;
export const enableCascading = (orb, handler, withInherit) =>
  defineProperties(orb, {
    [S.iterator]: {
      *value() {
        const value = handler(this);
        if (withInherit) defineProperties(value, { inherit: { value: orb } });
        yield value;
      },
    },
  });
