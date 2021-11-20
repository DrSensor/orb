export const reset = (orb) => orb(orb.initial),
  isOrb = (orb) => {
    const { value, set, [Symbol.toPrimitive]: get } = Object
      .getOwnPropertyDescriptors(orb);
    return value.set === set.value && value.get === get.value &&
      orb.effect instanceof Set;
  },
  cascade = (orb) => {
    const [orb$] = orb;
    return orb$;
  };

export * from "./bind.js";
export * from "./link.js";
export * from "./misc.js";
export * from "./query.js";
export * from "./queue.js";
export * from "./sync.js";
