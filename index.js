import "./internal.js";

export const bindProperties = (orb, obj, ...props) => {
  const effect = (value) => props.forEach((prop) => obj[prop] = value);
  orb.effect.add(effect);
  return effect;
};

export const unbind = (orb, ...effects) =>
  effects.every((effect) => orb.effect.delete(effect));

export const reset = (orb) => orb(orb.initial);

const queue$ = [];

export const queue = (effect) =>
  function () {
    const defer = () => effect.apply(this, arguments);
    queue$.unshift(defer);
    return defer;
  };

export const flush = () => {
  while (queue$.length) queue$.pop()();
};
