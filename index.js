import "./internal.js";

export const bindProperties = (orb, obj, ...props) => {
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
      for (const prop in dict) for (const obj of dict[prop]) obj[prop] = value;
    };
    orb.effect.add(effect);
    return effect;
  });

export const reset = (orb) => orb(orb.initial);

export const useEffect = (effect, orbs) =>
  orbs.forEach((orb) => orb.onchange = effect);

export const root = (orb) => Array.from(ancestor(orb)).at(-1);

export function* ancestor(orb) {
  let parent = orb.inherit;
  yield parent;
  while (parent = parent.inherit) yield parent;
}

export function* children(orb) {
  for (const effect of orb.effect) if (effect.inherit === orb) yield effect;
}

export function* descendant(orb) {
  // yield* descendant(yield* children); // TODO: check if recursive Generator `yield* self(yield* other)` works
  // TODO: replace 👇 if 👆 works!
  for (const child of children(orb)) {
    yield child;
    yield* descendant(child);
  }
}

const eachother = (list, callback) =>
  list.forEach((item, i) =>
    list.forEach((item$, i$) => i !== i$ && callback(item, item$))
  );

export const links = (...orbs) =>
    eachother(orbs, (orb, orb$) => orb.effect.add(orb$)),
  unlinks = (...orbs) =>
    eachother(orbs, (orb, orb$) => orb.effect.delete(orb$));

export const insync = (orb) => orb.inherit?.effect.has(orb),
  sync = (orb) => orb.inherit?.effect.add(orb),
  unlink = (orb) => orb.inherit?.effect.delete(orb),
  relink = (orb) => {
    if (insync(orb)) unlink(orb);
    return sync(orb);
  };

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
