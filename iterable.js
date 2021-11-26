import Orb from "./object.js";

export default function (iterable, transformObject = (object) => object) {
  const context = this;
  return {
    *[Symbol.iterator]() {
      for (const value of iterable) {
        yield typeof value == "object"
          ? transformObject.call(context, value)
          : typeof value != "function"
          ? Orb.call(context, value)
          : value;
      }
    },
  };
}
