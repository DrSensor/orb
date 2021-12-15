import Orb from "./primitive.js";
import { isFunction, isObject, iterator } from "./_internal.js";
const none = (object) => object;

export default function (iterable, transformObject = none) {
  const context = this;
  return createIterator(iterable, function* (value) {
    if (isObject(value)) {
      const result = transformObject.call(context, value);
      result[iterator] ? yield* result : yield result;
    } else {
      yield (!isFunction(value) ? Orb.call(context, value) : value);
    }
  });
}

export const depth = (depth, transformObject = none) =>
  function downlevel(object, level = 1) {
    return object[iterator] && level < depth // TODO: what happens if object is new Set? this decorator should preserve the container (e.g Set, SparseSet, Bitvector, ...)
      ? createIterator(object, function* (value) {
        yield downlevel.call(this, value, level + 1);
      })
      : transformObject.call(this.object);
  };

export const flatten = (depth, transformObject = none) =>
  function* downlevel(object, level = 1) {
    object[iterator]
      ? level < depth
        ? yield* createIterator(object, function* (value) {
          yield downlevel.call(this, value, level + 1);
        })
        : yield object
      : yield transformObject.call(this.object);
  };

const createIterator = (iterable, forEach) => ({
  *[iterator]() {
    for (const value of iterable) yield* forEach(value);
  },
});
