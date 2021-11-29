export const reset = (orb) => orb(orb.initial);

export const isLiteOrb = (orb) => {
  const { let: value, set, [Symbol.toPrimitive]: get } = Object
    .getOwnPropertyDescriptors(orb);
  return value.set === set.value && value.get === get.value;
};

export const isOrb = (orb) =>
  isLiteOrb(orb) &&
  ["object", "function"].some((type) => type == typeof orb.effect);

export const cascade = (orb) => {
  const [orb$] = orb;
  return orb$;
};
