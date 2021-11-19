export const reset = (orb) => orb(orb.initial),
  isOrb = (orb) => {
    const { value: { get, set } } = Object.getOwnPropertyDescriptors(orb);
    return orb === set && set === get && +orb === orb() &&
      orb.effect instanceof Set;
  };

export * from "./bind.js";
export * from "./link.js";
export * from "./misc.js";
export * from "./query.js";
export * from "./queue.js";
export * from "./sync.js";
