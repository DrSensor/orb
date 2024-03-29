import Orb, { override } from "../../../data/overridable.js";
import { enableCascading } from "../../../data/reactive/utils.js";

/** @comptime `const [$ident$] = Element` -> `let $ident$ = (value) => $ident$ = value` */
enableCascading(Element.prototype.constructor, (self) => {
  const orb = Orb((value) => element = value); // because attribute `$:let` only accept setter function
  const isValid = (value) =>
    [self].concat(self == Element ? [Text, Comment] : [])
      .some((type) => value instanceof type);

  let element;
  override(orb, {
    get: () => element,
    set(value) {
      if (isValid(value)) element.replaceWith?.(element = value);
      else {
        throw new TypeError(
          `can't replace element with ${value.constructor.name} while ${self.name} is expected`,
        );
      }
    },
  });

  return enableCascading(orb, () => element);
});
