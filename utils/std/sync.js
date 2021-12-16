export const insync = (orb) => orb.inherit?.effect.has(orb.set);

export const sync = (orb) => orb.inherit?.effect.add(orb.set);

export const unsync = (orb) => orb.inherit?.effect.delete(orb.set);

export const resync = (orb) => {
  if (insync(orb)) unsync(orb);
  return sync(orb);
};

const eachother = (ops, list, callback) =>
  list[ops]((item, i) =>
    list[ops]((item$, i$) => i !== i$ && callback(item, item$))
  );

export const isLinked = (...orbs) =>
  eachother("every", orbs, (orb, { set }) => orb.effect.has(set));

export const link = (...orbs) =>
  eachother("forEach", orbs, (orb, { set }) => orb.effect.add(set));

export const unlink = (...orbs) =>
  eachother("forEach", orbs, (orb, { set }) => orb.effect.delete(set));
