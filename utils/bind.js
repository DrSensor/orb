export const bind = (orb, obj, ...props) => {
  const effect = (value) => props.forEach((prop) => obj[prop] = value);
  orb.effect.add(effect);
  return effect;
};

export const unbind = (orb, ...effects) =>
  effects.every((effect) => orb.effect.delete(effect));

export const unbinds = (orbs, effects) =>
  effects.some((effect) => orbs.some((orb) => orb.effect.delete(effect)));

export const binds = (orbs, dict) =>
  orbs.map((orb) => {
    const effect = (value) => {
      for (const prop in dict) dict[prop].forEach((obj) => obj[prop] = value);
    };
    orb.effect.add(effect);
    return effect;
  });
