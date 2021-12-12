import Orb, { enableCascading, override } from "../../lite.js";

enableCascading(Element.prototype.constructor, (self) => {
  const orb = Orb((value) => element = value); // because attribute `$:let` only accept setter function
  const isValid = (value) =>
    [self].concat(self == Element ? [Text, Comment] : [])
      .some((type) => value instanceof type);

  let element;
  override(orb, {
    set(value) {
      if (isValid(value)) element.replaceWith?.(element = value);
    }, // FIXME: if !isValid(value): throw *idiomatic* Error type
  });

  return enableCascading(orb, () => element);
});
