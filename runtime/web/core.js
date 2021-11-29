import Orb, { enableCascading, override } from "../../lite.js";

enableCascading(Element.prototype.constructor, (self) => {
  const orb = Orb();
  const isValid = (value) =>
    [self].concat(self == Element ? [Text, Comment] : [])
      .some((type) => value instanceof type);

  let element;
  override(orb, {
    set(value) {
      if (isValid(value)) element.replaceWith?.(element = value);
    }, // FIXME: else throw *idiomatic* Error type
  });

  return enableCascading(orb, () => element);
});
