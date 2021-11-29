import Orb, { override } from "../../lite.js";
const { defineProperty } = Object, { iterator } = Symbol;

defineProperty(Element.prototype.constructor, iterator, {
  *value() {
    const orb = Orb();
    const isValid = (value) =>
      [this].concat(this == Element ? [Text, Comment] : [])
        .some((type) => value instanceof type);

    let element;
    override(orb, {
      set(value) {
        if (isValid(value)) element.replaceWith?.(element = value);
      }, // FIXME: else throw *idiomatic* Error type
    });

    yield defineProperty(orb, iterator, {
      *value() {
        yield element;
      },
    });
  },
});
