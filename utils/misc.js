export const reset = (orb) => orb(orb.initial);

export const isOrb = (orb) => {
  const { value, set, [Symbol.toPrimitive]: get } = Object
    .getOwnPropertyDescriptors(orb);
  return value.set === set.value && value.get === get.value &&
    orb.effect instanceof Set;
};

export const cascade = (orb) => {
  const [orb$] = orb;
  return orb$;
};
