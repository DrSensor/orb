export const setEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.effect = effect) || effect;

export const unsetEffect = (effect, orbs) =>
  orbs.forEach((orb) =>
    (!effect || effect == orb.effect) && (orb.effect = undefined)
  ) || effect;

const each = (orbs, o, e, effect) => orbs[o]((orb) => orb.effect[e](effect));

export const addEffect = (effect, orbs) =>
  each(orbs, "forEach", "add", effect) || effect;

export const deleteEffect = (effect, orbs) =>
  each(orbs, "forEach", "delete", effect) || effect;

export const someHasEffect = (effect, orbs) =>
  each(orbs, "some", "has", effect);

export const everyHasEffect = (effect, orbs) =>
  each(orbs, "every", "has", effect);

/** **WARNING** very slow operation */
export const replaceEffect = (prevEffect, newEffect, ...orbs) =>
  orbs.forEach((orb) => {
    const buffer = [];
    for (const effect of orb.effect) {
      buffer.push(effect !== prevEffect ? effect : newEffect);
      orb.effect.delete(effect);
    }
    buffer.forEach(orb.effect.add);
  });

export * from "./effect/decorator.js";
