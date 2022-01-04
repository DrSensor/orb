export const reset = (orb) => orb.set(orb.initial);

export const isOpaque = (orb) => {
  const { let: value, set, [Symbol.toPrimitive]: get } = Object
    .getOwnPropertyDescriptors(orb);
  return value?.set === set?.value && value?.get === get?.value;
};

export const isReactive = (orb) =>
  isOpaque(orb) &&
  ["object", "function"].some((type) => type == typeof orb.effect);

export const cascade = (orb) => ([orb] = orb, orb);

export const take = (orb) => {
  const [orb$] = orb;
  orb.effect?.delete(orb$.set);
  return orb$;
};

export const get = (orb) => orb[Symbol.toPrimitive]();
